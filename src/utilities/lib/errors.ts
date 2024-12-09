export type ServerError = 
    | "MISSING_TOKEN" // shouldn't happen
    | "INVALID_TOKEN" // not displayed to user
    | "DATABASE_ERROR" // internal error
    | "INVALID_USERNAME" // shouldn't happen
    | "USERNAME_ALREADY_TAKEN" // The username is already in use
    | "USER_NOT_FOUND" // shouldn't happen
    | "USER_EXISTS" // The email is already in use (Only if mail server is not in use)
    | "USER_MISMATCH" // Escalating to a different user
    | "INVALID_EMAIL" // shouldn't happen
    | "DISPLAY_NAME_TOO_LONG" // shouldn't happen
    | "DESCRIPTION_TOO_LONG" // shouldn't happen
    | "WEBSITE_TOO_LONG" // shouldn't happen
    | "CREDENTIAL_ERROR" // shouldn't happen
    | "INCORRECT_CODE" // The MFA code is incorrect
    | "SESSION_EXPIRED" // The session has expired
    | "IP_MISSING" // shouldn't happen
    | "INVALID_CAPTCHA" // The captcha token is invalid
    | "INTERNAL_CAPTCHA_ERROR" // shouldn't happen
    | "INTERNAL_EMAIL_ERROR" // shouldn't happen
    | "EMAIL_MISCONFIGURED" // The SMTP server is not configured
    | "RATE_LIMITED"; // The user has sent too many requests

export type RequestError = 
    | "INVALID_RESPONSE"
    | "TIMED_OUT"
    | "UNKNOWN_ERROR";

export type ClientErrorType = 
    | "USERNAME_ALREADY_TAKEN"
    | "USER_EXISTS"
    | "USER_MISMATCH"
    | "INCORRECT_CODE"
    | "SESSION_EXPIRED" 
    | "INVALID_CAPTCHA"
    | "EMAIL_MISCONFIGURED"
    | "RATE_LIMITED" 

    | "TIMED_OUT"
    | "UNKNOWN_ERROR"
    
    | "EMPTY_EMAIL" 
    | "EMPTY_PASSWORD" 
    | "INVALID_EMAIL" 
    | "WEAK_PASSWORD"
    | "INVALID_CREDENTIALS" 
    | "EMPTY_DISPLAY_NAME" 
    | "EMPTY_USERNAME" 
    | "LONG_DISPLAY_NAME" 
    | "INVALID_USERNAME"
    | "EMPTY_CODE"
    | "INVALID_CODE";

export class ClientError extends Error {
    constructor(public readonly type: ClientErrorType) {
        super(type);
    }

    static fromError(error: ServerError | RequestError): ClientError {
        return new ClientError(intoClientError(error));
    }

    toString() {
        return this.type;
    }
}

export const intoClientError = (error: ServerError | RequestError): ClientErrorType => {
    if (["USERNAME_ALREADY_TAKEN", "USER_EXISTS", "USER_MISMATCH", "INCORRECT_CODE", "SESSION_EXPIRED", "INVALID_CAPTCHA", "EMAIL_MISCONFIGURED", "RATE_LIMITED", "TIMED_OUT", "UNKNOWN_ERROR"].includes(error)) {
        return error as ClientErrorType;
    }
    return "UNKNOWN_ERROR";
};

