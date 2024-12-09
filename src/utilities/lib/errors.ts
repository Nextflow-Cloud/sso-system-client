export type ServerError = 
    | "MISSING_TOKEN"
    | "INVALID_TOKEN"
    | "DATABASE_ERROR"
    | "INVALID_USERNAME"
    | "USERNAME_ALREADY_TAKEN"
    | "USER_NOT_FOUND"
    | "USER_EXISTS"
    | "USER_MISMATCH"
    | "INVALID_EMAIL"
    | "DISPLAY_NAME_TOO_LONG"
    | "DESCRIPTION_TOO_LONG"
    | "WEBSITE_TOO_LONG"
    | "CREDENTIAL_ERROR"
    | "INCORRECT_CODE"
    | "SESSION_EXPIRED"
    | "IP_MISSING"
    | "INVALID_CAPTCHA"
    | "INTERNAL_CAPTCHA_ERROR"
    | "INTERNAL_EMAIL_ERROR"
    | "EMAIL_MISCONFIGURED"
    | "RATE_LIMITED";

export type ClientErrorType = 
    | "INVALID_CREDENTIALS" 
    | "SESSION_EXPIRED" 
    | "TOO_MANY_REQUESTS" 
    | "UNKNOWN_ERROR" 
    | "TIMED_OUT"
    | "INVALID_CAPTCHA"
    // TODO:
    | "ALREADY_EXISTS";

export class ClientError extends Error {
    constructor(public readonly type: ClientErrorType) {
        super(type);
    }

    static fromError(error: ServerError): ClientError {
        return new ClientError(intoClientError(error));
    }

    toString() {
        return this.type;
    }
}

export const intoClientError = (error: ServerError): ClientErrorType => {
    if (error === "SESSION_EXPIRED") {
        return "SESSION_EXPIRED";
    }
    if (error === "RATE_LIMITED") {
        return "TOO_MANY_REQUESTS";
    }
    if (error === "INVALID_CAPTCHA") {
        return "INVALID_CAPTCHA";
    }
    return "UNKNOWN_ERROR";
};

