import { createMemo } from "solid-js";
import SelectMenu from "./primitive/SelectMenu";
import { useGlobalState } from "../context";
import { Language, useTranslate } from "../utilities/i18n";

const LanguagePicker = () => {
    const state = createMemo(() => useGlobalState());
    const t = useTranslate();
    return (
        <SelectMenu onChange={e => {
            state().update("sessionData", { language: (e.target as HTMLSelectElement).value as Language });
            localStorage.setItem("lang", (e.target as HTMLSelectElement).value);
        }} value={state().get("sessionData").language}>
            <option value="en" class="t">{t("ENGLISH")} (English)</option>
            <option value="es">{t("SPANISH")} (Español)</option>
            <option value="fr">{t("FRENCH")} (Français)</option>
            <option value="zh-CN">{t("CHINESE_S")} (简体中文)</option>
            <option value="zh-TW">{t("CHINESE_T")} (繁體中文)</option>
            <option value="ja">{t("JAPANESE")} (日本語)</option>
            <option value="ko">{t("KOREAN")} (한국어)</option>
        </SelectMenu>
    )
}

export default LanguagePicker;