import { translator } from "@solid-primitives/i18n";
import { useGlobalState } from "../../context";
const languages = import.meta.glob("./*.json");
const l = Object.keys(languages).reduce((acc, key) => {
    const lang = key.split("/")[1].split(".")[0] as Language;
    acc[lang as Language] = async () => {
        const imp = languages[key] as () => Promise<Record<string, string>>;
        return await imp();
    };
    return acc;
}, {} as Record<Language, () => Promise<Record<string, string>>>);

export type Language = "en" | "es" | "fr";

const fetchDictionary = async (lang: Language) => {
    return await l[lang]();
}

import { createMemo, createResource } from "solid-js";

export const useTranslate = () => {
    const state = createMemo(() => useGlobalState());
    const language = createMemo(() => state().get("sessionData")?.language || "en");

    const [dict] = createResource(language, fetchDictionary);
    
    return translator(dict);
}

