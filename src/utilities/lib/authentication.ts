import { array, number, object, optional, string } from "superstruct";
import { callEndpoint } from "./routes";
import { decode, fromUint8Array, toUint8Array } from "js-base64";
import { Client } from "./manage";
import { get } from "@github/webauthn-json";
import { parseRequestOptionsFromJSON } from "@github/webauthn-json/browser-ponyfill";

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

export const RequestChallengeResponse = object({
    publicKey: object({
        challenge: string(),
        timeout: optional(number()),
        rpId: string(),
        allowCredentials: array(object()),
        userVerification: string(),
        extensions: object(),
    }),
    meditation: optional(string()),
});

// eval("window.toUint8Array = toUint8Array");
export const createSessionPasskey = async () => {
    const response = await callEndpoint("LOGIN_PASSKEYS_1", { escalate: false, stage: "BEGIN_LOGIN" });
    try {
        const credential = await get(response.message).catch(e => console.log(e));
        if (credential) {
            try {
                const response2 = await callEndpoint("LOGIN_PASSKEYS_2", { stage: "FINISH_LOGIN", continueToken: response.continueToken, message: credential as any });
                return new Client(null, response2.token);
            } catch {
                throw new Error("Invalid passkey");
            }
        } else {
            throw new Error("No passkey provided");
        }
    } catch {
        console.log("No passkey provided");
        throw new Error("No passkey provided");
    }
};

