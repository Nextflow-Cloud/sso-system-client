const wrappedFetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => Promise.race([
    fetch(input, init).catch(() => {
        throw new SessionError("UNKNOWN_ERROR");
    }), 
    new Promise((_, reject) => setTimeout(() => reject(new SessionError("TIMED_OUT")), 5000))
]) as Promise<Response>;

export class Session {
    constructor(private id: string | null, private accessToken: string) {}
    needsContinuation(): this is PartialSession {
        return this instanceof PartialSession;
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
        if (request.status === 401) {
            throw new SessionError("SESSION_EXPIRED");
        }
        if (request.status === 429) {
            throw new SessionError("TOO_MANY_REQUESTS");
        }
        if (!request.ok) {
            throw new SessionError("UNKNOWN_ERROR");
        }
        return await request.json();
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
        if (request.status === 401) {
            throw new SessionError("INVALID_CREDENTIALS");
        }
        if (request.status === 429) {
            throw new SessionError("TOO_MANY_REQUESTS");
        }
        if (!request.ok) {
            throw new SessionError("UNKNOWN_ERROR");
        }
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
        if (request.status === 401) {
            throw new SessionError("INVALID_CREDENTIALS");
        }
        if (request.status === 429) {
            throw new SessionError("TOO_MANY_REQUESTS");
        }
        if (!request.ok) {
            throw new SessionError("UNKNOWN_ERROR");
        }
    }
}

type AccountUpdateContinueFunction = (code: string) => Promise<void>;

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

export class PartialSession {
    constructor(private continuation: string) {}
    needsContinuation(): this is PartialSession {
        return this instanceof PartialSession;
    }

    async continue(code: string): Promise<Session> {
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
        return new Session(response.id, response.token);
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

export const createSession = async (email: string, password: string, persist?: boolean): Promise<Session | PartialSession> => {
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
        return new PartialSession(response.continueToken);
    } else {
        return new Session(response.id, response.token);
    }
};

export const validateSession = async (token: string): Promise<Session | undefined> => {
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
    return new Session(null, token);
};

export interface Credentials {
    email: string;
    password: string;
    displayName: string;
    username: string;
    captchaToken: string;
}

export const createAccount = async (credentials: Credentials): Promise<Session> => {
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
    return new Session(response.id, response.token);
}
