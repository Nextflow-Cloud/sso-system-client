const wrappedFetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => Promise.race([
    fetch(input, init).catch(() => {
        throw new SessionError("UNKNOWN_ERROR");
    }), 
    new Promise((_, reject) => setTimeout(() => reject(new SessionError("TIMED_OUT")), 5000))
]) as Promise<Response>;

const throwErrors = (response: Response) => {
    if (response.status === 401) {
        throw new SessionError("SESSION_EXPIRED");
    }
    if (response.status === 429) {
        throw new SessionError("TOO_MANY_REQUESTS");
    }
    if (!response.ok) {
        throw new SessionError("UNKNOWN_ERROR");
    }
}

export class Client {
    constructor(private id: string | null, private accessToken: string) {}
    needsContinuation(): this is PartialClient {
        return this instanceof PartialClient;
    }

    get token(): string {
        return this.accessToken;
    }

    async getSettings(): Promise<Settings> {
        // FIXME: stop duplicating this code
        const request = await wrappedFetch("/api/user", {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
        });
        throwErrors(request);
        const settings = await request.json();
        return settings;
    }

    async commitAccountSettings(password: string, settings: Partial<AccountSettings>): Promise<void | AccountUpdateContinueFunction> {
        const request = await wrappedFetch("/api/user", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ currentPassword: password, ...settings, stage: 1 }),
        });
        throwErrors(request);
        const response: { success: null; continueToken: string } | { success: true; continueToken: null; } = await request.json();
        if (response.continueToken) {
            return async (code: string) => {
                const request = await wrappedFetch("/api/user", {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code, continueToken: response.continueToken, stage: 2 }),
                });
                if (request.status === 401) {
                    throw new SessionError("INVALID_CREDENTIALS");
                }
                if (request.status === 429) {
                    throw new SessionError("TOO_MANY_REQUESTS");
                }
                if (!request.ok) {
                    throw new SessionError("UNKNOWN_ERROR");
                }
            };
        }
    }

    async commitProfile(profile: Partial<Profile>): Promise<void> {
        const request = await wrappedFetch("/api/user/profile", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...profile }),
        });
        throwErrors(request);
    }

    async getAllSessions(): Promise<Session[]> {
        const request = await wrappedFetch("/api/session", {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
        });
        throwErrors(request);
        return await request.json();
    }

    async logoutAll(): Promise<void> {
        const request = await wrappedFetch("/api/session/all", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
        });
        throwErrors(request);
    }

    async logout(id?: string): Promise<void> {
        const request = await wrappedFetch(`/api/session${id ? `/${id}` : ""}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
        });
        throwErrors(request);
    }

    async deleteAccount(password: string): Promise<void | AccountUpdateContinueFunction> {
        const request = await wrappedFetch("/api/user", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ stage: 1, password }),
        });
        throwErrors(request);
        const response: { success: null; continueToken: string } | { success: true; continueToken: null; } = await request.json();
        if (response.continueToken) {
            return async (code: string) => {
                const request = await wrappedFetch("/api/user", {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code, continueToken: response.continueToken, stage: 2 }),
                });
                throwErrors(request);
            };
        }
    }

    async configureMfa(password: string): Promise<MfaOperation> {
        const request = await wrappedFetch("/api/user/mfa", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ stage: 1, password }),
        });
        throwErrors(request);
        const response: { success: null; continueToken: string } & ({ qr: null; secret: null; codes: null } | { qr: string; secret: string; codes: string[] }) = await request.json();
        const continueFunction = async (code: string) => {
            const request = await wrappedFetch("/api/user/mfa", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code, continueToken: response.continueToken, stage: 2 }),
            });
            throwErrors(request);
        };
        if (response.qr) {
            return {
                continueFunction,
                qr: response.qr,
                secret: response.secret,
                pendingEnable: true,
                codes: response.codes,
            };
        } else {
            return {
                continueFunction,
                pendingEnable: false,
            };
        }
    }
}

export type MfaOperation = {
    continueFunction: AccountUpdateContinueFunction;
    pendingEnable: false;
} | {
    continueFunction: AccountUpdateContinueFunction;
    qr: string;
    secret: string;
    pendingEnable: true;
    codes: string[];
}

export interface Session {
    id: string;
    friendlyName: string;
    ipAddress?: string;
    location?: string;
    // lastActive: string;
}

export type AccountUpdateContinueFunction = (code: string) => Promise<void>;

export interface Settings {
    id: string;
    username: string;
    mfaEnabled: boolean;
    displayName: string;
    description: string;
    avatar: string;
}

export interface AccountSettings {
    username: string;
    newPassword: string;
}

export interface Profile {
    displayName: string;
    description: string;
    avatar: string;
}

export class PartialClient {
    constructor(private continuation: string) {}
    needsContinuation(): this is PartialClient {
        return this instanceof PartialClient;
    }

    async continue(code: string): Promise<Client> {
        const request = await wrappedFetch("/api/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ stage: 2, continueToken: this.continuation, code }),
        });
        if (request.status === 401) {
            throw new SessionError("INVALID_CREDENTIALS");
        }
        if (request.status === 403) {
            throw new SessionError("SESSION_EXPIRED");
        }
        if (request.status === 429) {
            throw new SessionError("TOO_MANY_REQUESTS");
        }
        if (!request.ok) {
            throw new SessionError("UNKNOWN_ERROR");
        }
        const response: { id: string; token: string } = await request.json();
        return new Client(response.id, response.token);
    };
}

export type SessionErrorType = 
    | "INVALID_CREDENTIALS" 
    | "SESSION_EXPIRED" 
    | "TOO_MANY_REQUESTS" 
    | "UNKNOWN_ERROR" 
    | "TIMED_OUT"
    | "INVALID_CAPTCHA"
    // TODO:
    | "ALREADY_EXISTS";

export class SessionError extends Error {
    message: SessionErrorType;
    constructor(message: SessionErrorType) {
        super(message);
        this.message = message;
    }
    toString(): SessionErrorType {
        return this.message;
    }
}

export const createSession = async (email: string, password: string, persist?: boolean): Promise<Client | PartialClient> => {
    const request = await wrappedFetch("/api/session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ stage: 1, email, password, persist }),
    });
    if (request.status === 429) {
        throw new SessionError("TOO_MANY_REQUESTS");
    }
    if (request.status === 401) {
        throw new SessionError("INVALID_CREDENTIALS");
    }
    if (!request.ok) {
        throw new SessionError("UNKNOWN_ERROR");
    }
    const response: { mfaEnabled: true; continueToken: string } | { mfaEnabled: false; id: string; token: string } = await request.json();
    if (response.mfaEnabled) {
        return new PartialClient(response.continueToken);
    } else {
        return new Client(response.id, response.token);
    }
};

export const validateSession = async (token: string): Promise<Client | undefined> => {
    const request = await Promise.race([
        fetch("/api/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        }).catch(() => {}), 
        new Promise(r => setTimeout(r, 5000))
    ]) as Response | undefined;
    if (!request || !request.ok) {
        return;
    }
    return new Client(null, token);
};

export interface Credentials {
    email: string;
    password: string;
    displayName: string;
    username: string;
    captchaToken: string;
}

export const createAccount = async (credentials: Credentials): Promise<Client> => {
    const request = await wrappedFetch("/api/user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    if (request.status === 429) {
        throw new SessionError("TOO_MANY_REQUESTS");
    }
    if (request.status === 401) {
        throw new SessionError("INVALID_CAPTCHA");
    }
    // TODO:
    if (request.status === 409) {
        throw new SessionError("ALREADY_EXISTS");
    }
    if (!request.ok) {
        throw new SessionError("UNKNOWN_ERROR");
    }
    const response: { id: string; token: string } = await request.json();
    return new Client(response.id, response.token);
}
