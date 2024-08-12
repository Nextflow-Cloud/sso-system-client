
// "SSO_SYSTEM": "نظام SSO Nextflow",
// "SSO_SYSTEM_VERSION": "الإصدار {} (الإصدار التجريبي)",
// "SSO_SYSTEM_COPYRIGHT": "حقوق النشر © {} Nextflow Cloud Technologies والمساهمين."
import de from "./de.json";
import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import it from "./it.json";
import ja from "./ja.json";
import ko from "./ko.json";
import nl from "./nl.json";
import pt from "./pt.json";
import ru from "./ru.json";
import vi from "./vi.json";
import uk from "./uk.json";
import zh_CN from "./zh_CN.json";
import zh_TW from "./zh_TW.json";

const LANGUAGES = { de, en, es, fr, it, ja, ko, nl, pt, ru, uk, vi, zh_CN, zh_TW };
export type Language = keyof typeof LANGUAGES;
export type SupportedString = keyof typeof LANGUAGES["en"];
export const translate = (language: Language, key: SupportedString): string => {
    const l = LANGUAGES[language];
    return l[key];
};

// class Translator<T extends Record<string, Record<string, string>>> {
//     constructor(private translations: T) {}
//     translate(language: keyof T, key: keyof T[keyof T]): string {
//         return this.translations[language][key];
//     }
// }

// export default new Translator(LANGUAGES);
