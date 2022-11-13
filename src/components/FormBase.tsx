import { ComponentChildren } from "preact";
import { StateUpdater, useEffect, useRef, useState } from "preact/hooks";
import i18n from "../utilities/i18n";
import Footer from "./Footer";
import logo from "../logo.png";
import styled from "styled-components";
import SelectMenu from "./primitive/SelectMenu";

const FormBase = styled.form`
    padding-top: 2rem;
    padding-bottom: 2rem;
    padding-left: 4rem;
    padding-right: 4rem;
    overflow: hidden;
    background-color: rgb(30 41 59);
    width: 62%;

    opacity: ${(props: { loading: boolean; }) => props.loading ? 0.5 : 1};
`;

const FormContainerDesktop = styled.div`
    display: flex;
    backdrop-filter: blur(12px);
    background-color: rgb(255 255 255 / 0.1);
    color: white;
    overflow: hidden;
    width: 750px;
    
    margin: auto;
    box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.4);
    border-radius: 15px;
    transition: all .3s;

    z-index: 2;
`;

const FormContainerMobile = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    backdrop-filter: blur(12px);
    color: white;
    width: 100%;
    height: 100%;
    padding-top: 2rem;
    padding-bottom: 2rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    overflow: scroll;
    background-color: rgb(255 255 255 / 0.1);
    
    margin: auto;
    box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.4);
    border-radius: 15px;
    transition: all .3s;

    z-index: 2;
`;

const SidePanel = styled.div`
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 38%;
`;

const LogoContainerDesktop = styled.div`
    margin-bottom: 1.25rem;
`;

const Logo = styled.img`
    height: 2rem;
`;

const MainDesktop = styled.main`
    /* background: linear-gradient(315deg,  0%, rgba(0,119,193,1) 40%, rgba(160,69,210,1) 100%); */
    background: #001F42;
    /* background: #421A57; */
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 100vh;
    display: flex;
    flex-direction: column;  

    width: 100%;
    height: 100%;
    justify-content: center;
`;

const MainMobile = styled(MainDesktop)`
    padding: 1.25rem;
`;

const GroupMobile = styled.div`
    text-align: center;
`;

const DetailsMobile = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 1.25rem;
`;

const LogoContainerMobile = styled(LogoContainerDesktop)`
    display: flex;
    justify-content: center;
`;

const Container = ({ children, loading, lang, setLang }: { children: ComponentChildren; loading: boolean; lang: string; setLang: StateUpdater<string> }) => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    
    const formRef = useRef<HTMLFormElement>(null);
    
    useEffect(() => {
        // eslint-disable-next-line no-undef
        const listener = (e: SubmitEvent) => e.preventDefault();
        formRef.current?.addEventListener("submit", listener);
        const sizeListener = () => {
            setIsDesktop(window.innerWidth >= 768);
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
            <MainDesktop>
                <FormContainerDesktop> 
                    <SidePanel>
                        <div>
                            <LogoContainerDesktop>
                                <Logo src={logo} alt="Nextflow" />
                            </LogoContainerDesktop>
                            <h2>{i18n.translate(lang, "welcome")}</h2>
                            <p>{i18n.translate(lang, "description")}</p>
                        </div>
                        <SelectMenu onChange={e => {
                            setLang((e.target as HTMLSelectElement).value);
                            localStorage.setItem("lang", (e.target as HTMLSelectElement).value);
                        }} value={lang}>
                            <option value="en" class="t">{i18n.translate(lang, "english")} (English)</option>
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
                        </SelectMenu>
                    </SidePanel>
                    <FormBase loading={loading} ref={formRef}>
                        {children}
                    </FormBase>
                </FormContainerDesktop>
                <Footer desktop={true} lang={lang} />
            </MainDesktop>
        );
    } else {
        return (
            <MainMobile>
                <FormContainerMobile>
                    <GroupMobile>
                        <DetailsMobile>
                            <LogoContainerMobile>
                                <Logo src={logo} alt="Nextflow" />
                            </LogoContainerMobile>
                            <h2>{i18n.translate(lang, "welcome")}</h2>
                            <p>{i18n.translate(lang, "description")}</p>
                        </DetailsMobile>
                        <div>
                            {children}
                        </div>
                    </GroupMobile>
                    <GroupMobile>
                        <SelectMenu onChange={e => {
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
                        </SelectMenu>
                    </GroupMobile>
                </FormContainerMobile>
                <Footer desktop={false} lang={lang} />
            </MainMobile>
        );
    }
};

export default Container;
