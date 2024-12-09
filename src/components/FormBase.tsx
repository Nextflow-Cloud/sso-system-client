import { Accessor, createEffect, createMemo, createSignal, onCleanup, ParentProps, Setter } from "solid-js";
import { styled } from "solid-styled-components";
import SelectMenu from "./primitive/SelectMenu";
import { Language, useTranslate } from "../utilities/i18n";
import Footer from "./Footer";
import Logo from "./Logo";
import { useGlobalState } from "../context";
import LanguagePicker from "./LanguagePicker";

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


const Container = ({ children, loading, }: ParentProps<{ loading: Accessor<boolean>; }>) => {
    const [isDesktop, setIsDesktop] = createSignal(window.innerWidth >= 768);
    const state = createMemo(() => useGlobalState());
    const t = useTranslate();
    
    let form: HTMLFormElement | undefined;
    
    createEffect(() => {
        const listener = (e: SubmitEvent) => e.preventDefault();
        form?.addEventListener("submit", listener);
        const sizeListener = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        addEventListener("resize", sizeListener);
        onCleanup(() => {
            form?.removeEventListener("submit", listener);
            removeEventListener("resize", sizeListener);
        });
    });

    if (isDesktop()) {
        return (
            <MainDesktop>
                <FormContainerDesktop> 
                    <SidePanel>
                        <div>
                            <LogoContainerDesktop>
                                <Logo />
                            </LogoContainerDesktop>
                            <h2>{t("WELCOME")}</h2>
                            <p>{t("DESCRIPTION")}</p>
                        </div>
                        <LanguagePicker />
                    </SidePanel>
                    <FormBase loading={loading} ref={form}>
                        {children}
                    </FormBase>
                </FormContainerDesktop>
                <Footer desktop={true} />
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
                        <h2>{t("WELCOME")}</h2>
                        <p>{t("DESCRIPTION")}</p>
                    </DetailsMobile>
                    <div>
                        {children}
                    </div>
                </GroupMobile>
                <GroupMobile>
                    <LanguagePicker />
                </GroupMobile>
            </FormContainerMobile>
            <Footer desktop={false} />
        </MainMobile>
    );
    
};

export default Container;
