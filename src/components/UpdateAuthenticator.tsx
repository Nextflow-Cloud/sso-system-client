import Dialog from "@corvu/dialog";
import { Content, Overlay } from "./Dialog";
import { createMemo, createSignal, Match, Show, Switch } from "solid-js";
import Input from "./primitive/Input";
import Button from "./primitive/Button";
import { AccountUpdateContinueFunction } from "../utilities/lib/authentication";
import { useGlobalState } from "../context";
import Box from "./primitive/Box";

export type AuthenticateType = "ENABLE_MFA" | "DISABLE_MFA" | "UPDATE_ACCOUNT" | "DELETE_ACCOUNT";
type AuthenticateStage = "PASSWORD" | "ONBOARD" | "DELETE" | "MFA";


const UpdateAuthenticator = (props: { type?: AuthenticateType }) => {
    const [stage, setStage] = createSignal<AuthenticateStage>("PASSWORD");
    const [qrCode, setQrCode] = createSignal<string>("");
    const [codes, setCodes] = createSignal<string[]>([]);
    const [secret, setSecret] = createSignal<string>("");
    const [password, setPassword] = createSignal<string>("");
    const [mfaCode, setMfaCode] = createSignal<string>("");
    const [continueFunction, setContinueFunction] = createSignal<AccountUpdateContinueFunction>();
    const state = createMemo(() => useGlobalState());
    const dialogContext = createMemo(() => Dialog.useContext());
    
    const next = async () => {
        if (stage() === "PASSWORD") {
            if (props.type === "ENABLE_MFA") {
                const session = state().get("session");
                if (!session) return console.error("No session found");
                // FIXME: potential state out of sync issue if MFA is enabled elsewhere
                const result = await session.configureMfa(password());
                if (!result.pendingEnable) throw new Error("State is out of sync!");
                setQrCode(result.qr);
                setSecret(result.secret);
                setCodes(result.codes);
                setContinueFunction(() => result.continueFunction); 

                setStage("ONBOARD");
            } else if (props.type === "DISABLE_MFA") {
                const session = state().get("session");
                if (!session) return console.error("No session found");
                const result = await session.configureMfa(password());
                if (result.pendingEnable) throw new Error("State is out of sync!");
                setContinueFunction(() => result.continueFunction);

                setStage("MFA");
            } else if (props.type === "UPDATE_ACCOUNT") {
                const session = state().get("session");
                if (!session) return console.error("No session found");
                const stagedAccountSettings = state().get("stagedAccountSettings");
                if (!stagedAccountSettings) return console.error("No staged account settings found");
                const result = await session.commitAccountSettings(password(), stagedAccountSettings); // FIXME: get the state somehow
                if (!result) dialogContext().setOpen(false); // we're finished here since user doesn't use MFA
                else setContinueFunction(() => result);

                setStage("MFA");
            } else if (props.type === "DELETE_ACCOUNT") {
                setStage("DELETE");
            }
        } else
        if (stage() === "ONBOARD") {            
            //transition to next stage
            setStage("MFA");
        } else
        if (stage() === "DELETE") {
            const session = state().get("session");
            if (!session) return console.error("No session found");
            const result = await session.deleteAccount(password());
            if (!result) {
                dialogContext().setOpen(false);
                localStorage.removeItem("token");
                window.location.href = "/";               
            } else {
                setContinueFunction(() => result);
                setStage("MFA");
            }
        } else
        if (stage() === "MFA") {
            const cf = continueFunction();
            if (!cf) return console.error("No continue function found");
            await cf(mfaCode());
            dialogContext().setOpen(false);
            if (props.type === "ENABLE_MFA") state().update("settings", { mfaEnabled: true });
            else if (props.type === "DISABLE_MFA") state().update("settings", { mfaEnabled: false });
            else if (props.type === "UPDATE_ACCOUNT") state().set("stagedAccountSettings", undefined);
            else if (props.type === "DELETE_ACCOUNT") {
                localStorage.removeItem("token");
                window.location.href = "/";
            }
        }
    }
    return (
        <>
            <Dialog.Portal>
                <Overlay />
                <Content>
                    <Switch fallback={
                        <>
                            <h1>Invalid dialog type</h1>
                            <p>This is an error.</p>
                        </>
                    }>
                        <Match when={stage() === "PASSWORD"}>
                            <h1>Enter your password</h1>
                            <Input password placeholder="Password" loading={false} onChange={e => setPassword((e.target as HTMLInputElement).value)} value={password()} />
                            <Button onClick={next}>Continue</Button>
                        </Match>
                        <Match when={stage() === "ONBOARD"}>
                            <h1>Set up two factor authentication</h1>
                            <img src={`data:image/png;base64,${qrCode()}`} alt="QR code" width="300" height="300" />
                            <p>Scan the QR code or enter the following secret into your preferred authenticator app.</p>
                            <p>{secret()}</p>
                            <p>Additionally, here are some backup codes in case you ever lose access. They can only be used once. Please be mindful that they can be used to gain access to your account in place of the authenticator app.</p>
                            <p>{codes().join("\n")}</p>
                            <p>This information will never be shown again, so please store them securely.</p>
                            <Button onClick={next}>Continue</Button>
                        </Match>
                        <Match when={stage() === "DELETE"}>
                            <h1>Are you sure you want to delete your account and all associated data?</h1>
                            <p>This action is irreversible.</p>
                            <Box type="error">
                                <h1>This is your last warning.</h1>
                            </Box>
                            <Button onClick={next}>Delete</Button>
                        </Match>
                        <Match when={stage() === "MFA"}>
                            <h1>Enter your two factor authentication code</h1>
                            <Input placeholder="Code" loading={false} onChange={e => setMfaCode((e.target as HTMLInputElement).value)} value={mfaCode()} />
                            <Show when={props.type === "ENABLE_MFA"}>
                                <Button onClick={() => setStage("ONBOARD")}>Back</Button>
                            </Show>
                            <Button onClick={next}>Finish</Button>
                        </Match>
                    </Switch>
                </Content>
            </Dialog.Portal>
        </>
    )
};

export default UpdateAuthenticator;