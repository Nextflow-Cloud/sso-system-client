import { client } from "@serenity-kit/opaque";
import { callEndpoint } from "./routes";
import { ClientError } from "./errors";
import { Client } from "./manage";

export class PartialClient {
    constructor(private continuation: string) {}
    needsContinuation(): this is PartialClient {
        return this instanceof PartialClient;
    }

    async continue(code: string): Promise<Client> {
        const response = await callEndpoint("LOGIN_3", {
            stage: "MFA",
            continueToken: this.continuation,
            code,
        });
        return new Client(null, response.token);
    };
}

export const createSession = async (email: string, password: string, escalate?: string, persist?: boolean): Promise<Client | PartialClient> => {
    const { clientLoginState, startLoginRequest } = client.startLogin({ password });
    const response = await callEndpoint("LOGIN_1", {
        stage: "BEGIN_LOGIN",
        email,
        message: startLoginRequest,
        escalate: escalate ? true : false,
        token: escalate
    });
    const result = client.finishLogin({ clientLoginState, password, loginResponse: response.message });
    if (!result) { 
        throw new ClientError("INVALID_CREDENTIALS");
    }
    const response2 = await callEndpoint("LOGIN_2", {
        stage: "FINISH_LOGIN",
        continueToken: response.continueToken,
        message: result.finishLoginRequest,
        persist,
    });
    if (response2.mfaEnabled) {
        return new PartialClient(response2.continueToken!);
    } else {
        return new Client(null, response2.token!);
    }
};


export const validateSession = async (token: string): Promise<Client> => {
    await callEndpoint("VALIDATE", { token });
    return new Client(null, token);
};
