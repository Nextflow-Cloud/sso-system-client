import { client } from "@serenity-kit/opaque";
import { callEndpoint } from "./routes";
import { Client } from "./manage";
import { getBrowser } from "../client";

export type RegistrationContinuation = {
    emailEnabled: true;
    continue: (username: string, password: string, displayName: string, emailToken: string) => Promise<Client>;
} | {
    emailEnabled: false;
    continue: (username: string, password: string, displayName: string) => Promise<Client>;
}

export const createAccount = async (email: string, captchaToken: string): Promise<RegistrationContinuation> => {
    const response = await callEndpoint("REGISTER_1", {
        stage: "VERIFY_EMAIL",
        email,
        captchaToken,
    });
    if (!response.emailEnabled) {
        return {
            emailEnabled: false,
            continue: async (username: string, password: string, displayName: string) => {
                const data = client.startRegistration({ password });
                const response1 = await callEndpoint("REGISTER_2", {
                    stage: "BEGIN_REGISTRATION",
                    emailToken: response.emailToken!,
                    message: data.registrationRequest,
                });
                const data2 = client.finishRegistration({ 
                    password, 
                    clientRegistrationState: data.clientRegistrationState, 
                    registrationResponse: response1.message 
                });
                const response2 = await callEndpoint("REGISTER_3", {
                    stage: "REGISTER",
                    continueToken: response1.continueToken,
                    message: data2.registrationRecord,
                    displayName,
                    username,
                });
                return new Client(null, response2.token);
            },
        }
    } else {
        return {
            emailEnabled: true,
            continue: async (username: string, password: string, displayName: string, emailToken: string) => {
                const data = client.startRegistration({ password });
                const response = await callEndpoint("REGISTER_2", {
                    stage: "BEGIN_REGISTRATION",
                    emailToken,
                    message: data.registrationRequest,
                });
                const data2 = client.finishRegistration({ 
                    password, 
                    clientRegistrationState: data.clientRegistrationState, 
                    registrationResponse: response.message 
                });
                const response2 = await callEndpoint("REGISTER_3", {
                    stage: "REGISTER",
                    continueToken: response.continueToken,
                    message: data2.registrationRecord,
                    displayName,
                    username,
                    friendlyName: getBrowser()
                });
                return new Client(null, response2.token);
            }
        }
    }
};
