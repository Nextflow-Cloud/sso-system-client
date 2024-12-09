import { object, string, literal, boolean, optional, Infer, is, Struct, nullable, union, array, partial } from "superstruct";
import { ClientError, ServerError } from "./errors";
import { Profile, Session, CurrentUser, Passkey } from "./manage";
import { RequestChallengeResponse } from "./authentication";

const routes = {
    LOGIN_1: { 
        method: "POST" as const, 
        route: "/api/session",
        types: {
            request: object({
                stage: literal("BEGIN_LOGIN"),
                email: string(),
                message: string(),
                escalate: boolean(),
                token: optional(string()),
            }),
            response: object({
                continueToken: string(),
                message: string(),
            })
        }
    },
    LOGIN_2: { 
        method: "POST" as const, 
        route: "/api/session",
        types: {
            request: object({
                stage: literal("FINISH_LOGIN"),
                continueToken: string(),
                message: string(),
                persist: optional(boolean()),
                friendlyName: optional(string()),
            }),
            response: object({
                mfaEnabled: boolean(),
                continueToken: nullable(string()),
                token: nullable(string()),
            })
        }
    },
    LOGIN_3:  {
        method: "POST" as const,
        route: "/api/session",
        types: {
            request: object({
                stage: literal("MFA"),
                continueToken: string(),
                code: string(),
            }),
            response: object({
                token: string(),
            })
        }
    },
    REGISTER_1: {
        method: "POST" as const,
        route: "/api/user",
        types: {
            request: object({
                stage: literal("VERIFY_EMAIL"),
                email: string(),
                captchaToken: string(),
            }),
            response: object({
                emailEnabled: boolean(),
                emailToken: nullable(string()),
            })
        }
    },
    REGISTER_2: {
        method: "POST" as const,
        route: "/api/user",
        types: {
            request: object({
                stage: literal("BEGIN_REGISTRATION"),
                emailToken: string(),
                message: string(),
            }),
            response: object({
                continueToken: string(),
                message: string(),
            })
        }
    },
    REGISTER_3: {
        method: "POST" as const,
        route: "/api/user",
        types: {
            request: object({
                stage: literal("REGISTER"),
                continueToken: string(),
                message: string(),
                friendlyName: optional(string()),
                username: string(),
                displayName: string(),
            }),
            response: object({
                token: string(),
            })
        }
    },
    GET_USER: {
        method: "GET" as const,
        route: "/api/user",
        types: {
            request: undefined,
            response: CurrentUser,
        }
    },
    UPDATE_ACCOUNT: {
        method: "PATCH" as const,
        route: "/api/user",
        types: {
            request: object({
                username: optional(string()),
                email: optional(string()),
                escalationToken: string(),
            }),
            response: object({})
        }
    },
    DELETE_ACCOUNT: {
        method: "DELETE" as const,
        route: "/api/user",
        types: {
            request: object({
                escalationToken: string(),
            }),
            response: object({})
        }
    },
    CONFIGURE_MFA_1: {
        method: "PATCH" as const,
        route: "/api/user/mfa",
        types: {
            request: object({
                stage: literal("TOGGLE"),
                escalationToken: string(),
            }),
            response: union([object({
                continueToken: string(),
                qr: string(),
                secret: string(),
                codes: array(string()),
            }), object({})])
        }
    },
    CONFIGURE_MFA_2: {
        method: "PATCH" as const,
        route: "/api/user/mfa",
        types: {
            request: object({
                stage: literal("ENABLE_VERIFY"),
                continueToken: string(),
                code: string(),
            }),
            response: object({})
        }
    },
    UPDATE_PROFILE: {
        method: "PATCH" as const,
        route: "/api/user/profile",
        types: {
            request: partial(Profile),
            response: object({})
        }
    },
    FORGOT_PASSWORD_1: {
        method: "POST" as const,
        route: "/api/forgot",
        types: {
            request: object({
                stage: literal("VERIFY_EMAIL"),
                email: string(),
            }),
            response: object({})
        }
    },
    FORGOT_PASSWORD_2: {
        method: "POST" as const,
        route: "/api/forgot",
        types: {
            request: object({
                stage: literal("RESET_PASSWORD"),
                message: string(),
                continueToken: string(),
            }),
            response: object({
                continueToken: string(),
                message: string(),
            })
        }
    },
    FORGOT_PASSWORD_3: {
        method: "POST" as const,
        route: "/api/forgot",
        types: {
            request: object({
                stage: literal("FINISH_RESET"),
                message: string(),
                continueToken: string(),
            }),
            response: object({})
        }
    },
    VALIDATE: {
        method: "POST" as const,
        route: "/api/validate",
        types: {
            request: object({
                token: string(),
            }),
            response: object({})
        }
    },
    GET_SESSIONS: {
        method: "GET" as const,
        route: "/api/session",
        types: {
            request: undefined,
            response: array(Session),
        }
    },
    LOGOUT: {
        method: "DELETE" as const,
        route: "/api/session",
        types: {
            request: undefined,
            response: object({})
        }
    },
    LOGOUT_ALL: {
        method: "DELETE" as const,
        route: "/api/session/all",
        types: {
            request: undefined,
            response: object({})
        }
    },
    LOGOUT_OTHER: {
        method: "DELETE" as const,
        route: "/api/session/{id}",
        types: {
            request: undefined,
            response: object({})
        }
    },
    LOGIN_PASSKEYS_1: {
        method: "POST" as const,
        route: "/api/session/passkeys",
        types: {
            request: object({
                stage: literal("BEGIN_LOGIN"),
                escalate: boolean(),
                token: optional(string()),
            }),
            response: object({
                continueToken: string(),
                message: object(),
            })
        }
    },
    LOGIN_PASSKEYS_2: {
        method: "POST" as const,
        route: "/api/session/passkeys",
        types: {
            request: object({
                stage: literal("FINISH_LOGIN"),
                continueToken: string(),
                message: object(),
                persist: optional(boolean()),
                friendlyName: optional(string()),
            }),
            response: object({
                token: string(),
            })
        }
    },
    GET_PASSKEYS: {
        method: "GET" as const,
        route: "/api/user/passkeys",
        types: {
            request: undefined,
            response: array(Passkey),
        }
    },
    DELETE_PASSKEY: {
        method: "DELETE" as const,
        route: "/api/user/passkeys/{id}",
        types: {
            request: object({
                escalationToken: string(),
            }),
            response: object({})
        }
    },
    REGISTER_PASSKEYS_1: {
        method: "POST" as const,
        route: "/api/user/passkeys",
        types: {
            request: object({
                stage: literal("BEGIN_REGISTER"),
                escalationToken: string(),
            }),
            response: object({
                continueToken: string(),
                message: object(),
            })
        }
    },
    REGISTER_PASSKEYS_2: {
        method: "POST" as const,
        route: "/api/user/passkeys",
        types: {
            request: object({
                stage: literal("FINISH_REGISTER"),
                continueToken: string(),
                message: object(),
                friendlyName: optional(string()),
            }),
            response: object({})
        }
    },
    UPDATE_PASSWORD_1: {
        method: "PATCH" as const,
        route: "/api/user/password",
        types: {
            request: object({
                stage: literal("BEGIN_UPDATE"),
                escalationToken: string(),
                message: string(),
            }),
            response: object({
                continueToken: string(),
                message: string(),
            })
        }
    },
    UPDATE_PASSWORD_2: {
        method: "PATCH" as const,
        route: "/api/user/password",
        types: {
            request: object({
                stage: literal("FINISH_UPDATE"),
                continueToken: string(),
                message: string(),
            }),
            response: object({})
        }
    },
}

type GenericResponse<T> = { error: ServerError } | T;
type InferUndefined<T> = T extends undefined ? undefined : T extends Struct<any, any> ? Infer<T> : never;
export type Route = keyof typeof routes;
export type Method<T extends Route> = typeof routes[T]["method"];
export type ApiRequest<T extends Route> = InferUndefined<typeof routes[T]["types"]["request"]>;
export type ApiResponse<T extends Route> = Infer<typeof routes[T]["types"]["response"]>;

export const callEndpoint = async <T extends Route>(
    route: T, 
    body: Method<T> extends "GET" ? undefined : ApiRequest<T>, 
    authorization?: string, 
    replace?: Record<string, string>
): Promise<ApiResponse<T>> => {
    let headers: Record<string, string> = {};
    if (routes[route].method !== "GET") headers["Content-Type"] = "application/json";
    if (authorization) headers["Authorization"] = authorization;
    let dynamicRoute = routes[route].route;
    if (replace) {
        dynamicRoute = Object.keys(replace).reduce((acc, val) => {
            return acc.replace(`{${val}}`, replace[val]);
        }, routes[route].route);
    }
    const request = await Promise.race([fetch(dynamicRoute, {
        method: routes[route].method,
        headers,
        body: routes[route].method === "GET" ? undefined : JSON.stringify(body),
    }), new Promise((_, reject) => setTimeout(() => reject(new ClientError("TIMED_OUT")), 5000))]) as Response;
    // try {
        const response: GenericResponse<ApiResponse<T>> = await request.json();
        if ("error" in response) {
            throw ClientError.fromError(response.error);
        }
        if (is(response, routes[route].types.response as Struct)) {
            return response;
        }
        throw new ClientError("UNKNOWN_ERROR");
    // } catch {
    //     throw new ClientError("UNKNOWN_ERROR");
    // }
};

