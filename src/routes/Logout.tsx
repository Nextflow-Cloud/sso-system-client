import { createSignal, onMount, Show } from "solid-js";
import { validateSession } from "../utilities/lib/authentication";
import Fade from "../components/Fade";
import Title from "../components/primitive/Title";

const Logout = () => {
    const [validSession, setValidSession] = createSignal(false);
    const [checked, setChecked] = createSignal(false);

    const checkToken = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const session = await validateSession(token);
            if (session) {
                setValidSession(true);
                await session.logout().then(() => localStorage.removeItem("token"));
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
                           <Title>Logged out</Title>
                            <p>You are not logged in.</p>
                        </>
                    )
                }>
                    <Title>Logged out</Title>
                    <p>You have been logged out. Thank you for using Nextflow services, and have a wonderful day.</p>
                </Show>
            </Fade>
            
        </Show>
    )
};
export default Logout;
