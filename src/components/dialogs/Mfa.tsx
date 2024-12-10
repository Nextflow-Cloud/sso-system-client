import Dialog from "@corvu/dialog";
import { Content, Overlay } from "../Dialog";
import { Accessor, createMemo, createSignal, Match, onMount, Setter, Show, Switch } from "solid-js";
import Button from "../primitive/Button";
import { useGlobalState } from "../../context";
import Box from "../primitive/Box";
import OtpInput from "../primitive/OtpInput";
import { ClientError, ClientErrorType } from "../../utilities/lib/errors";
import { MfaContinueFunction } from "../../utilities/lib/manage";
import { useTranslate } from "../../utilities/i18n";

type AuthenticateStage =  "ONBOARD" | "MFA";
type AuthenticateError = ClientErrorType | "EMPTY_CODE" | "INVALID_CODE";

// TODO: replace this with state.set("loading", true)
// TODO: add language to state
const Mfa = (props: { loading: Accessor<boolean>; setLoading: Setter<boolean> }) => {
    const [stage, setStage] = createSignal<AuthenticateStage>("ONBOARD");
    const [qrCode, setQrCode] = createSignal<string>("");
    const [codes, setCodes] = createSignal<string[]>([]);
    const [secret, setSecret] = createSignal<string>("");
    const [mfaCode, setMfaCode] = createSignal<string>("");
    const [continueFunction, setContinueFunction] = createSignal<MfaContinueFunction>();
    const [error, setError] = createSignal<AuthenticateError>();
    const state = createMemo(() => useGlobalState());
    const dialogContext = createMemo(() => Dialog.useContext());
    const t = useTranslate();

    onMount(async () => {
        const client = state().get("session");
        if (!client || !client.isElevated()) return console.error("No session found");
        try {
            const result = await client.configureMfa();
        
            if (!result.pendingEnable) {
                // no pending enable, so we're done
                closeDialog();
                return;
            } else {
                setQrCode(result.qr);
                setCodes(result.codes);
                setSecret(result.secret);
                setContinueFunction(() => result.continue);
            }
        } catch (e) {
            const error = (e as ClientError).toString();
            setError(error);
        }
    });
    
    const next = async () => {
        if (error()) setError(undefined);
        props.setLoading(true);
        if (stage() === "ONBOARD") {            
            //transition to next stage
            setStage("MFA");
        } else
        if (stage() === "MFA") {
            const cf = continueFunction();
            if (!cf) return console.error("No continue function found");
            if (!mfaCode()) return setError("EMPTY_CODE");
            if (mfaCode().length !== 8) return setError("INVALID_CODE");
            try {
                await cf(mfaCode());
                state().update("settings", { mfaEnabled: true });
                closeDialog();
            } catch (e) {
                const error = (e as ClientError).toString();
                setError(error === "INVALID_CREDENTIALS" ? "INVALID_CODE" : error);
            }
        }
        props.setLoading(false);
    };

    const closeDialog = () => {
        dialogContext().setOpen(false);
        setStage("ONBOARD");
        setMfaCode("");
        setQrCode("");  
        setCodes([]);
        setSecret("");
        setContinueFunction(undefined);
    };

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
                        <Match when={stage() === "ONBOARD"}>
                            <h1>{t("MFA_SETUP")}</h1>
                            <img src={`data:image/png;base64,${qrCode()}`} alt="QR code" width="300" height="300" />
                            <p>{t("MFA_SETUP_SECRET")}</p>
                            <p>{secret()}</p>
                            <p style={{ "text-align": "center" }}>{t("MFA_SETUP_BACKUP")}</p>
                            <p>{codes().join("\n")}</p>
                            <p>{t("MFA_SETUP_NEVER_SHOWN_AGAIN")}</p>
                        </Match>
                        <Match when={stage() === "MFA"}>
                            <h1>{t("ENTER_CODE")}</h1>
                            <OtpInput code={mfaCode} setCode={setMfaCode} />
                            <Button onClick={() => setStage("ONBOARD")} disabled={props.loading()}>{t("BACK")}</Button>
                        </Match>
                    </Switch>
                    <Show when={error() !== undefined}>
                        <Box type="error">
                            {error()}
                        </Box>
                    </Show>
                    <Button onClick={next} disabled={props.loading()}>{t("CONTINUE")}</Button>
                    <Button onClick={closeDialog} disabled={props.loading()}>{t("CANCEL")}</Button>
                </Content>
            </Dialog.Portal>
        </>
    )
};

export default Mfa;