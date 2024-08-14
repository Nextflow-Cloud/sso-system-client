import { createMemo, createSignal, Match, onMount, ParentProps, Show, Switch } from "solid-js";
import { validateSession } from "../utilities/lib/authentication";
import { Navigate } from "@solidjs/router";
import { useGlobalState } from "../context";

const Authenticated = (props: ParentProps) => {
    const [checked, setChecked] = createSignal(false);
    const [authenticated, setAuthenticated] = createSignal(false);
    const state = createMemo(() => useGlobalState())
    
    const checkToken = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const session = await validateSession(token);
            if (session) {
                setAuthenticated(true);
                state()?.setSession(session);
            }
        }
        setChecked(true);
    };

    onMount(() => {
        checkToken();
    });

    return (
        <Show when={checked()}>
            <Switch>
                <Match when={authenticated()}>{props.children}</Match>
                <Match when={!authenticated()}>
                    <Navigate href={`/login?continue=${encodeURIComponent(location.href)}`} />
                </Match>
            </Switch>
        </Show>
    )
};

export default Authenticated;
