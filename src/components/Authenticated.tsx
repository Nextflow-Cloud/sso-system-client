import { createMemo, createSignal, Match, onMount, ParentProps, Show, Switch } from "solid-js";
import { Navigate } from "@solidjs/router";
import { useGlobalState } from "../context";
import { validateSession } from "../utilities/lib/login";

const Authenticated = (props: ParentProps) => {
    const [checked, setChecked] = createSignal(false);
    const [authenticated, setAuthenticated] = createSignal(false);
    const state = createMemo(() => useGlobalState())
    
    const checkToken = async () => {
        const token = localStorage.getItem("token");
        const escalationToken = localStorage.getItem("escalationToken");
        if (token) {
            try {
                const session = await validateSession(token, escalationToken || undefined);
                setAuthenticated(true);
                state().set("session", session);
            } catch {}
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
