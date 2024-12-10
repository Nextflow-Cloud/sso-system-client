import Dialog from "@corvu/dialog";
import { Content, Overlay } from "../Dialog";
import { Accessor, createMemo, createSignal, Setter, Show } from "solid-js";
import Button from "../primitive/Button";
import { useGlobalState } from "../../context";
import Box from "../primitive/Box";
import { ClientError, ClientErrorType } from "../../utilities/lib/errors";
import { useNavigate } from "@solidjs/router";
import { useTranslate } from "../../utilities/i18n";

type AuthenticateError = ClientErrorType;

// TODO: replace this with state.set("loading", true)
// TODO: add language to state
const Delete = (props: { loading: Accessor<boolean>; setLoading: Setter<boolean> }) => {
    const [error, setError] = createSignal<AuthenticateError>();
    const state = createMemo(() => useGlobalState());
    const dialogContext = createMemo(() => Dialog.useContext());
    const loading = createMemo(() => state().get("sessionData")?.loading);
    const navigate = useNavigate();
    const t = useTranslate();
    
    const next = async () => {
        if (error()) setError(undefined);
        props.setLoading(true);
        const client = state().get("session");
        if (!client || !client.isElevated()) return console.error("No session found");
        try {
            await client.deleteAccount();
            navigate("/login");
        } catch (e) {
            const error = (e as ClientError).toString();
            setError(error);
        }
        props.setLoading(false);
    };

    const closeDialog = () => dialogContext().setOpen(false);

    return (
        <>
            <Dialog.Portal>
                <Overlay />
                <Content>
                    <h1>{t("CONFIRM_DELETION")}</h1>
                    <p>{t("CONFIRM_DELETION_DESCRIPTION")}</p>
                    <p>{t("CONFIRM_DELETION_WARNING")}</p>
                    <Box type="error">
                        <h1>{t("CONFIRM_DELETION_LAST_WARNING")}</h1>
                    </Box>
                    <Show when={error() !== undefined}>
                        <Box type="error">
                            {t(error()!)}
                        </Box>
                    </Show>
                    <Button onClick={next} disabled={props.loading()}>{t("CONTINUE")}</Button>
                    <Button onClick={closeDialog} disabled={props.loading()}>{t("CANCEL")}</Button>
                </Content>
            </Dialog.Portal>
        </>
    )
};

export default Delete;