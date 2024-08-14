import { createContext, ParentProps, useContext } from "solid-js";
import { AccountSettings, Client, Settings } from "./utilities/lib/authentication";

const StateContext = createContext<GlobalState>();

export const useGlobalState = () => useContext(StateContext);

class GlobalState {
    session?: Client;
    settings?: Settings;
    stagedAccountSettings?: Partial<AccountSettings>;
    setSession(session: Client) {
        this.session = session;
    }
    clearSession() {
        this.session = undefined;
    }
    updateSettings(settings: Settings) {
        this.settings = settings;
    }
    setStagedAccountSettings(settings: Partial<AccountSettings>) {
        this.stagedAccountSettings = settings;
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
