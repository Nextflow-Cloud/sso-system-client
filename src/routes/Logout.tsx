import { createSignal, onMount, Show } from "solid-js";
import Fade from "../components/Fade";
import Title from "../components/primitive/Title";
import { validateSession } from "../utilities/lib/login";
import { useTranslate } from "../utilities/i18n";

const Logout = () => {
    const [validSession, setValidSession] = createSignal(false);
    const [checked, setChecked] = createSignal(false);
    const t = useTranslate();

    const checkToken = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const session = await validateSession(token);
            if (session) {
                setValidSession(true);
                await session.logout().then(() => localStorage.removeItem("token")).then(() => localStorage.removeItem("escalationToken"));
            }
        }
        setChecked(true);
    };

    onMount(() => {
        checkToken();
    });

    return (
        <Show when={checked()} fallback={<div />}>
            <Fade hiding={false}>
                <Show when={validSession()} fallback={
                    (
                        <>
                           <Title>{t("LOGGED_OUT")}</Title>
                            <p>{t("LOGGED_OUT_NOT_LOGGED_IN")}</p>
                        </>
                    )
                }>
                    <Title>{t("LOGGED_OUT")}</Title>
                    <p>{t("LOGGED_OUT_SUCCESS")}</p>
                </Show>
            </Fade>
            
        </Show>
    )
};
export default Logout;
