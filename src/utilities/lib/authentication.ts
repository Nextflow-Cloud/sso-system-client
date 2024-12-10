import { array, number, object, optional, string } from "superstruct";
import { callEndpoint } from "./routes";
import { Client } from "./manage";
import { get } from "@github/webauthn-json";
import { getBrowser } from "../client";

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


export interface Credentials {
    email: string;
    password: string;
    displayName: string;
    username: string;
    captchaToken: string;
}


export const createSessionPasskey = async (existingSession?: string) => {
    const response = await callEndpoint("LOGIN_PASSKEYS_1", { escalate: false, stage: "BEGIN_LOGIN", token: existingSession });
    try {
        const credential = await get(response.message);
        if (credential) {
            try {
                const response2 = await callEndpoint("LOGIN_PASSKEYS_2", { stage: "FINISH_LOGIN", continueToken: response.continueToken, message: credential as any, friendlyName: getBrowser(),  });
                return new Client(null, response2.token);
            } catch {}
        }
    } catch {}
};

