import { ComponentChildren } from "preact";
import { StateUpdater, useEffect, useRef, useState } from "preact/hooks";
import i18n from "../utilities/i18n";
import Footer from "./Footer";
import logo from "../logo.png";

const FormBase = ({ children, loading, lang, setLang }: { children: ComponentChildren; loading: boolean; lang: string; setLang: StateUpdater<string> }) => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1280);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
    const formRef = useRef<HTMLFormElement>(null);
    
    useEffect(() => {
        // eslint-disable-next-line no-undef
        const listener = (e: SubmitEvent) => e.preventDefault();
        formRef.current?.addEventListener("submit", listener);
        const sizeListener = () => {
            setIsDesktop(window.innerWidth >= 1280);
            setIsMobile(window.innerWidth < 768);
        };
        addEventListener("resize", sizeListener);
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            formRef.current?.removeEventListener("submit", listener);
            removeEventListener("resize", sizeListener);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formRef.current]);

    if (isDesktop) {
        return (
            <div className="main">
                <div className="inner flex backdrop-blur-md bg-white bg-opacity-50 w-7/12 overflow-hidden"> {/* w-1/2 */}
                    <div className="p-10 flex flex-col justify-between w-4/12"> {/* w-2/5 */}
                        <div>
                            <div className="logo pb-5">
                                <img src={logo} alt="Nextflow" className="h-8" />
                            </div>
                            <div className="title">
                                <h1 className="text-3xl mb-2"><b>{i18n.translate(lang, "welcome")}</b></h1>
                                <h2>{i18n.translate(lang, "description")}</h2>
                            </div>
                        </div>
                        <div class="w-full">
                            <select className="rounded-md p-2 mt-5 w-full" onChange={e => {
                                setLang((e.target as HTMLSelectElement).value);
                                localStorage.setItem("lang", (e.target as HTMLSelectElement).value);
                            }} value={lang}>
                                <option value="en">{i18n.translate(lang, "english")} (English)</option>
                                <option value="es">{i18n.translate(lang, "spanish")} (Español)</option>
                                <option value="fr">{i18n.translate(lang, "french")} (Français)</option>
                                <option value="de">{i18n.translate(lang, "german")} (Deutsch)</option>
                                <option value="it">{i18n.translate(lang, "italian")} (Italiano)</option>
                                <option value="pt">{i18n.translate(lang, "portuguese")} (Português)</option>
                                <option value="nl">{i18n.translate(lang, "dutch")} (Nederlands)</option>
                                <option value="pl">{i18n.translate(lang, "polish")} (Polski)</option>
                                <option value="ru">{i18n.translate(lang, "russian")} (Русский)</option>
                                <option value="uk">{i18n.translate(lang, "ukrainian")} (Українська)</option>
                                <option value="zh">{i18n.translate(lang, "chinese")} (中文)</option>
                                <option value="ja">{i18n.translate(lang, "japanese")} (日本語)</option>
                                <option value="ko">{i18n.translate(lang, "korean")} (한국어)</option>
                                <option value="vi">{i18n.translate(lang, "vietnamese")} (Tiếng Việt)</option>
                            </select>
                        </div>

                    </div>
                    <form className="bg-white py-8 px-16 w-2/3 overflow-hidden" style={{
                        opacity: loading ? 0.5 : 1
                    }} ref={formRef}>
                        {children}
                    </form>
                </div>
                <Footer desktop={true} />
            </div>
        );
    } else if (isMobile) {
        return (
            <div className="main p-5">
                <div className="inner flex flex-col justify-between backdrop-blur-md bg-white bg-opacity-50 w-full h-full py-8 px-5 overflow-scroll">
                    <div class="text-center">
                        <div class="flex-col mb-5">
                            <div className="logo pb-5 text-center">
                                <img src="/logo.png" alt="Nextflow" className="h-8" />
                            </div>
                            <div className="title">
                                <h1 className="text-3xl mb-2 text-center"><b>{i18n.translate(lang, "welcome")}</b></h1>
                                <h2 class="text-center">{i18n.translate(lang, "description")}</h2>
                            </div>
                        </div>
                        <div>
                            {children}
                        </div>
                    </div>
                    <div class="text-center">
                        <select className="rounded-md p-2 mt-5" onChange={e => {
                            setLang((e.target as HTMLSelectElement).value);
                            localStorage.setItem("lang", (e.target as HTMLSelectElement).value);
                        }} value={lang}>
                            <option value="en">{i18n.translate(lang, "english")} (English)</option>
                                <option value="es">{i18n.translate(lang, "spanish")} (Español)</option>
                                <option value="fr">{i18n.translate(lang, "french")} (Français)</option>
                                <option value="de">{i18n.translate(lang, "german")} (Deutsch)</option>
                                <option value="it">{i18n.translate(lang, "italian")} (Italiano)</option>
                                <option value="pt">{i18n.translate(lang, "portuguese")} (Português)</option>
                                <option value="nl">{i18n.translate(lang, "dutch")} (Nederlands)</option>
                                <option value="pl">{i18n.translate(lang, "polish")} (Polski)</option>
                                <option value="ru">{i18n.translate(lang, "russian")} (Русский)</option>
                                <option value="uk">{i18n.translate(lang, "ukrainian")} (Українська)</option>
                                <option value="zh">{i18n.translate(lang, "chinese")} (中文)</option>
                                <option value="ja">{i18n.translate(lang, "japanese")} (日本語)</option>
                                <option value="ko">{i18n.translate(lang, "korean")} (한국어)</option>
                                <option value="vi">{i18n.translate(lang, "vietnamese")} (Tiếng Việt)</option>
                        </select>
                    </div>
                </div>
                <Footer desktop={false} />
            </div>
        );
    } else {
        return (
            <div className="main p-5">
                <div className="inner flex backdrop-blur-md bg-white bg-opacity-50 overflow-scroll">
                    <div className="p-10 flex flex-col justify-between w-4/12">
                        <div>
                            <div className="logo pb-5">
                                <img src="/logo.png" alt="Nextflow" className="h-8" />
                            </div>
                            <div className="title">
                                <h1 className="text-3xl mb-2"><b>{i18n.translate(lang, "welcome")}</b></h1>
                                <h2>{i18n.translate(lang, "description")}</h2>
                            </div>
                        </div>
                        <div class="w-full">
                            <select className="rounded-md p-2 mt-5 w-full" onChange={e => {
                                setLang((e.target as HTMLSelectElement).value);
                                localStorage.setItem("lang", (e.target as HTMLSelectElement).value);
                            }} value={lang}>
                                <option value="en">{i18n.translate(lang, "english")} (English)</option>
                                <option value="es">{i18n.translate(lang, "spanish")} (Español)</option>
                                <option value="fr">{i18n.translate(lang, "french")} (Français)</option>
                                <option value="de">{i18n.translate(lang, "german")} (Deutsch)</option>
                                <option value="it">{i18n.translate(lang, "italian")} (Italiano)</option>
                                <option value="pt">{i18n.translate(lang, "portuguese")} (Português)</option>
                                <option value="nl">{i18n.translate(lang, "dutch")} (Nederlands)</option>
                                <option value="pl">{i18n.translate(lang, "polish")} (Polski)</option>
                                <option value="ru">{i18n.translate(lang, "russian")} (Русский)</option>
                                <option value="uk">{i18n.translate(lang, "ukrainian")} (Українська)</option>
                                <option value="zh">{i18n.translate(lang, "chinese")} (中文)</option>
                                <option value="ja">{i18n.translate(lang, "japanese")} (日本語)</option>
                                <option value="ko">{i18n.translate(lang, "korean")} (한국어)</option>
                                <option value="vi">{i18n.translate(lang, "vietnamese")} (Tiếng Việt)</option>
                            </select>
                        </div>
                    </div>
                    <form className="bg-white py-8 px-16 w-2/3" style={{
                        opacity: loading ? 0.5 : 1
                    }} ref={formRef}>
                        {children}
                    </form>
                </div>
                <Footer desktop={false} />
            </div>
        );
    }
};

export default FormBase;
