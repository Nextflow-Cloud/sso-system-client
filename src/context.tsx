import { createContext, ParentProps, useContext } from "solid-js";
import { AccountSettings, Client, Settings } from "./utilities/lib/authentication";

const StateContext = createContext<GlobalState>();

export const useGlobalState = () => {
    const context = useContext(StateContext);
    if (!context) throw new Error("useGlobalState must be used within a StateProvider");
    return context;
};

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
    updateSettings(settings: Partial<Settings>) {
        if (this.settings)
            this.settings = { ...this.settings, ...settings };
        else
            this.settings = settings as Settings;
    }
    setStagedAccountSettings(settings?: Partial<AccountSettings>) {
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
