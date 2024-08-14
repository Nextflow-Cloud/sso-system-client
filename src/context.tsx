import { createContext, ParentProps, useContext } from "solid-js";
import { Client } from "./utilities/lib/authentication";

const StateContext = createContext<GlobalState>();

export const useGlobalState = () => useContext(StateContext);

class GlobalState {
    session?: Client;
    setSession(session: Client) {
        this.session = session;
    }
    clearSession() {
        this.session = undefined;
    }
}

export const state = new GlobalState();

export const StateProvider = (props: ParentProps) => {
    return (
        <StateContext.Provider value={state}>
            {props.children}
        </StateContext.Provider>
    );
};
