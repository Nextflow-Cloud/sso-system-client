import { Accessor, createEffect, createSignal, ParentProps, Setter } from "solid-js";
import { styled } from "solid-styled-components";
import SelectMenu from "./primitive/SelectMenu";
import { Language, translate } from "../utilities/i18n";
import Footer from "./Footer";
import Logo from "./Logo";

const FormBase = styled.form`
    padding-top: 2rem;
    padding-bottom: 2rem;
    padding-left: 4rem;
    padding-right: 4rem;
    overflow: hidden;
    background-color: #ffffff;
    width: 62%;

    opacity: ${(props: { loading: Accessor<boolean>; }) => props.loading() ? 0.5 : 1};
`;

const FormContainerDesktop = styled.div`
    display: flex;
    backdrop-filter: blur(12px);
    background-color: rgb(255 255 255 / 0.1);
    color: var(--foreground);
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
    /* color: white; */
    color: var(--foreground);
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

    scrollbar-width: none;

    z-index: 2;
`;

const SidePanel = styled.div`
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 38%;
`;

const MainDesktop = styled.main`
    background: var(--background);
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

const LogoContainerMobile = styled.div`
    margin-bottom: 1.25rem;
    display: flex;
    justify-content: center;
`;

const LogoContainerDesktop = styled.div`
    margin-bottom: 1.25rem;
`;


const Container = ({ children, loading, lang, setLang }: ParentProps<{ loading: Accessor<boolean>; lang: Accessor<Language>; setLang: Setter<Language> }>) => {
    const [isDesktop, setIsDesktop] = createSignal(window.innerWidth >= 768);
    
    let form: HTMLFormElement | undefined;
    
    createEffect(() => {
        const listener = (e: SubmitEvent) => e.preventDefault();
        form?.addEventListener("submit", listener);
        const sizeListener = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        addEventListener("resize", sizeListener);
        return () => {
            form?.removeEventListener("submit", listener);
            removeEventListener("resize", sizeListener);
        };
    }, [form]);

    if (isDesktop()) {
        return (
            <MainDesktop>
                <FormContainerDesktop> 
                    <SidePanel>
                        <div>
                            <LogoContainerDesktop>
                                <Logo />
                            </LogoContainerDesktop>
                            <h2>{translate(lang(), "WELCOME")}</h2>
                            <p>{translate(lang(), "DESCRIPTION")}</p>
                        </div>
                        <SelectMenu onChange={e => {
                            setLang((e.target as HTMLSelectElement).value as Language);
                            localStorage.setItem("lang", (e.target as HTMLSelectElement).value);
                        }} value={lang()}>
                            <option value="en" class="t">{translate(lang(), "ENGLISH")} (English)</option>
                            <option value="es">{translate(lang(), "SPANISH")} (Español)</option>
                            <option value="fr">{translate(lang(), "FRENCH")} (Français)</option>
                            <option value="de">{translate(lang(), "GERMAN")} (Deutsch)</option>
                            <option value="it">{translate(lang(), "ITALIAN")} (Italiano)</option>
                            <option value="pt">{translate(lang(), "PORTUGUESE")} (Português)</option>
                            <option value="nl">{translate(lang(), "DUTCH")} (Nederlands)</option>
                            <option value="ru">{translate(lang(), "RUSSIAN")} (Русский)</option>
                            <option value="uk">{translate(lang(), "UKRAINIAN")} (Українська)</option>
                            <option value="zh_CN">{translate(lang(), "CHINESE_S")} (简体中文)</option>
                            <option value="zh_TW">{translate(lang(), "CHINESE_T")} (繁體中文)</option>
                            <option value="ja">{translate(lang(), "JAPANESE")} (日本語)</option>
                            <option value="ko">{translate(lang(), "KOREAN")} (한국어)</option>
                            <option value="vi">{translate(lang(), "VIETNAMESE")} (Tiếng Việt)</option>
                        </SelectMenu>
                    </SidePanel>
                    <FormBase loading={loading} ref={form}>
                        {children}
                    </FormBase>
                </FormContainerDesktop>
                <Footer desktop={true} lang={lang} />
            </MainDesktop>
        );
    } 
    return (
        <MainMobile>
            <FormContainerMobile>
                <GroupMobile>
                    <DetailsMobile>
                        <LogoContainerMobile>
                            <Logo />
                        </LogoContainerMobile>
                        <h2>{translate(lang(), "WELCOME")}</h2>
                        <p>{translate(lang(), "DESCRIPTION")}</p>
                    </DetailsMobile>
                    <div>
                        {children}
                    </div>
                </GroupMobile>
                <GroupMobile>
                    <SelectMenu onChange={e => {
                        setLang((e.target as HTMLSelectElement).value as Language);
                        localStorage.setItem("lang", (e.target as HTMLSelectElement).value);
                    }} value={lang()}>
                    <option value="en" class="t">{translate(lang(), "ENGLISH")} (English)</option>
                    <option value="es">{translate(lang(), "SPANISH")} (Español)</option>
                    <option value="fr">{translate(lang(), "FRENCH")} (Français)</option>
                    <option value="de">{translate(lang(), "GERMAN")} (Deutsch)</option>
                    <option value="it">{translate(lang(), "ITALIAN")} (Italiano)</option>
                    <option value="pt">{translate(lang(), "PORTUGUESE")} (Português)</option>
                    <option value="nl">{translate(lang(), "DUTCH")} (Nederlands)</option>
                    <option value="ru">{translate(lang(), "RUSSIAN")} (Русский)</option>
                    <option value="uk">{translate(lang(), "UKRAINIAN")} (Українська)</option>
                    <option value="zh_CN">{translate(lang(), "CHINESE_S")} (简体中文)</option>
                    <option value="zh_TW">{translate(lang(), "CHINESE_T")} (繁體中文)</option>
                    <option value="ja">{translate(lang(), "JAPANESE")} (日本語)</option>
                    <option value="ko">{translate(lang(), "KOREAN")} (한국어)</option>
                    <option value="vi">{translate(lang(), "VIETNAMESE")} (Tiếng Việt)</option>
                    </SelectMenu>
                </GroupMobile>
            </FormContainerMobile>
            <Footer desktop={false} lang={lang} />
        </MainMobile>
    );
    
};

export default Container;
