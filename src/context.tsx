import { Accessor, createContext, createSignal, ParentProps, Setter, useContext } from "solid-js";
import { Client, CurrentUser } from "./utilities/lib/manage";
import { Language } from "./utilities/i18n";

const StateContext = createContext<GlobalState>();

export const useGlobalState = () => {
    const context = useContext(StateContext);
    if (!context) throw new Error("useGlobalState must be used within a StateProvider");
    return context;
};

interface SessionData {
    language: Language,
    loading: boolean;
}

interface GlobalStateKeyMap {
    session?: Client;
    settings?: CurrentUser;
    sessionData: SessionData;
}

class GlobalState {
    private state: Partial<Record<keyof GlobalStateKeyMap, GlobalStateKeyMap[keyof GlobalStateKeyMap]>> = {
        sessionData: { language: localStorage.getItem("lang") as Language || "fr", loading: false }
    };
    private random: Accessor<number>;
    private setRandom: Setter<number>;
    constructor() {
        const [random, setRandom] = createSignal(Math.random());
        this.random = random;
        this.setRandom = setRandom;
    }

    get<T extends keyof GlobalStateKeyMap>(key: T): GlobalStateKeyMap[T] {
        this.random();
        return this.state[key] as GlobalStateKeyMap[T];
    }

    set<T extends keyof GlobalStateKeyMap>(key: T, value: GlobalStateKeyMap[T]) {
        this.state[key] = value;
        this.setRandom(Math.random());
    }

    update<T extends keyof GlobalStateKeyMap>(key: T, value: Partial<GlobalStateKeyMap[T]>) {
        this.state[key] = { ...this.state[key], ...value };
        this.setRandom(Math.random());
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
