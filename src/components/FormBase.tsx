import { ComponentChildren } from "preact";
import { StateUpdater } from "preact/hooks";
import i18n from "../utilities/i18n";
import Footer from "./Footer";

const FormBase = ({ children, loading, lang, setLang }: { children: ComponentChildren; loading: boolean; lang: string; setLang: StateUpdater<string> }) => {
    return (
        <div className="main">
            <div className="inner flex backdrop-blur-md bg-white bg-opacity-50 w-1/2"> {/* w-1/2 */}
                <div className='p-10 flex flex-col justify-between w-4/12'> {/* w-2/5 */}
                    <div>
                        <div className="logo pb-5">
                            <img src="/logo.png" alt="Nextflow" className='h-8' />
                        </div>
                        <div className="title">
                            <h1 className='text-3xl mb-2'><b>{i18n.translate(lang, "welcome")}</b></h1>
                            <h2>{i18n.translate(lang, "description")}</h2>
                        </div>

                        {/* <div className="footer">
                            <div className="links">
                                <a href="https://nextflow.cloud/docs/">Documentation</a>
                                <a href="https://nextflow.cloud/docs/faq/">FAQ</a>
                                <a href="https://nextflow.cloud/docs/tutorials/">Tutorials</a>
                                <a href="https://nextflow.cloud/docs/api/">API</a>
                            </div>
                        </div> */}
                    </div>
                    <div>
                        <select className='rounded-md p-2 mt-5' onChange={e => {
                            setLang((e.target as HTMLSelectElement).value);
                            localStorage.setItem("lang", (e.target as HTMLSelectElement).value);
                        }} value={lang}>
                            <option value="en">{i18n.translate(lang, "english")} (English)</option>
                            <option value="es">{i18n.translate(lang, "spanish")} (Espa??ol)</option>
                            <option value="fr">{i18n.translate(lang, "french")} (Fran??ais)</option>
                            <option value="de">{i18n.translate(lang, "german")} (Deutsch)</option>
                            <option value="it">{i18n.translate(lang, "italian")} (Italiano)</option>
                            <option value="ru">{i18n.translate(lang, "russian")} (??????????????)</option>
                            <option value="zh">{i18n.translate(lang, "chinese")} (??????)</option>
                            <option value="ja">{i18n.translate(lang, "japanese")} (?????????)</option>
                            <option value="ko">{i18n.translate(lang, "korean")} (?????????)</option>
                        </select>
                    </div>

                </div>
                <form className='bg-white py-8 px-16 w-2/3 overflow-hidden' style={{
                    opacity: loading ? 0.5 : 1
                }}>
                    {children}
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default FormBase;
