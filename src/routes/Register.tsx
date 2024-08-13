import HCaptcha from "solid-hcaptcha";
import Button from "../components/primitive/Button";
import Input from "../components/primitive/Input";
import Title from "../components/primitive/Title";
import Box from "../components/primitive/Box";
import Link from "../components/primitive/Link";
import Fade from "../components/Fade";
import ErrorText from "../components/ErrorText";
import { CAPTCHA_KEY, TRUSTED_SERVICES } from "../constants";
import { styled } from "solid-styled-components";
import { Language, translate } from "../utilities/i18n";
import { Accessor, createSignal, Match, onMount, Setter, Show, Switch } from "solid-js";
import { createAccount, SessionError, SessionErrorType, validateSession } from "../utilities/lib/authentication";
import { useNavigate } from "@solidjs/router";
const ButtonContainer = styled.div`
    & > :not([hidden]) ~ :not([hidden]) {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
    }
`;

const calculateEntropy = (string?: string) => string ? Math.round(string.length * Math.log([
    { re: /[a-z]/, length: 26 }, 
    { re: /[A-Z]/, length: 26 }, 
    { re: /[0-9]/, length: 10 }, 
    { re: /[^a-zA-Z0-9]/, length: 33 },
].reduce((length, charset) => length + (charset.re.test(string) ? charset.length : 0), 0)) / Math.LN2): 0;

type RegisterStage = "credentials" | "verify" | "done" | "skip";
type InputError = "EMPTY_EMAIL" | "INVALID_EMAIL" | "WEAK_PASSWORD" | "INVALID_CAPTCHA" | "EMPTY_DISPLAY_NAME" | "EMPTY_USERNAME" | "LONG_DISPLAY_NAME" | "INVALID_USERNAME";

const Register = ({ loading, setLoading, lang }: { loading: Accessor<boolean>; setLoading: Setter<boolean>; lang: Accessor<Language>; }) => {
    const [error, setError] = createSignal<SessionErrorType | InputError>();
    const [stage, setStage] = createSignal<RegisterStage>("credentials");
    const [checked, setChecked] = createSignal(false);

    const [username, setUsername] = createSignal("");
    const [displayName, setDisplayName] = createSignal("");
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [captchaToken, setCaptchaToken] = createSignal("");
    const [hiding, setHiding] = createSignal(false);

    let captcha: HCaptcha | undefined;

    const navigate = useNavigate();

    const register = async () => {
        setError();
        setLoading(true);
        if (stage() === "credentials") {
            if (!email().trim()) {
                setLoading(false);
                setError("EMPTY_EMAIL");
                return;
            }
            const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
            const match = email().trim().match(emailRegex);
            if (!match || match.length !== 1) {
                setLoading(false);
                setError("INVALID_EMAIL");
                return;
            }
            setEmail(match[0]);
            const entropy = calculateEntropy(password());
            if (entropy < 64) {
                setLoading(false);
                setError("WEAK_PASSWORD");
                return;
            }
            if (!displayName().trim()) {
                setLoading(false);
                setError("EMPTY_DISPLAY_NAME");
                return;
            }
            if (!username().trim()) {
                setLoading(false);
                setError("EMPTY_USERNAME");
                return;
            }
            if (displayName().trim().length > 64) {
                setLoading(false);
                setError("LONG_DISPLAY_NAME");
                return;
            }
            if (!(/^[0-9A-Za-z_.-]{3,32}$/).test(username().trim())) {
                setLoading(false);
                setError("INVALID_USERNAME");
                return;
            }
            setLoading(false);
            setHiding(true);
            await new Promise(r => setTimeout(r, 1000));
            setStage("verify");
            setHiding(false);
        } else
        if (stage() === "verify") {
            try {
                const session = await createAccount({
                    username: username().trim(),
                    displayName: displayName().trim(),
                    email: email().trim(),
                    password: password(),
                    captchaToken: captchaToken()
                });
                setLoading(false);
                setHiding(true);
                await new Promise(r => setTimeout(r, 1000));
                setStage("done");
                setHiding(false);

                localStorage.setItem("token", session.token);
                await continueToRegisteredService(session.token);
            } catch (e) {
                setLoading(false);
                setError((e as SessionError).toString());
            }
        }
    };

    const continueToRegisteredService = async (token: string) => {        
        if ("__TAURI_INTERNALS__" in window) {
            const tauri = (window as any).__TAURI_INTERNALS__;
            const response = await tauri.invoke("login", { token });
            console.log(response);
        } else {
            setTimeout(() => {
                const getContinueUrl = new URLSearchParams(window.location.search).get("continue");
                const url = new URL(getContinueUrl ? getContinueUrl : TRUSTED_SERVICES[0]);
                if (TRUSTED_SERVICES.some(x => x === url.origin + url.pathname)) {
                    url.searchParams.set("token", token);
                }
                window.location.href = url.toString();
            }, 1000);
        }
    }
    const press = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            register();
        }
    };
    const checkToken = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const session = await validateSession(token);
            if (session) {
                setStage("skip");
                setTimeout(() => {
                    const getContinueUrl = new URLSearchParams(window.location.search).get("continue");
                    const url = new URL(getContinueUrl ? getContinueUrl : TRUSTED_SERVICES[0]);
                    if (TRUSTED_SERVICES.some(x => x === url.origin + url.pathname)) {
                        url.searchParams.set("token", token as string);
                    }
                    window.location.href = url.toString();
                }, 1000);
            }
        }
        setChecked(true);
    };
    const login = () => {
        const continueUrl = new URLSearchParams(window.location.search).get("continue");
        const href = continueUrl ? `/login?continue=${encodeURIComponent(continueUrl)}` : "/login";
        navigate(href);
    };
    const back = async () => {
        setLoading(false);
        setHiding(true);
        await new Promise(r => setTimeout(r, 1000));
        setStage("credentials");
        setHiding(false);
    };
    const initCaptcha = () => {
        captcha?.execute();
    };

    onMount(() => {
        checkToken();
    });

    return (
        <Show when={checked()} fallback={<div />}>
            <Switch fallback={<div />}>
                <Match when={stage() === "credentials"}>
                    <Fade hiding={hiding()}>
                        <Title>{translate(lang(), "REGISTER")}</Title>
                        <div>
                            <Input
                                placeholder={translate(lang(), "DISPLAY_NAME")}
                                loading={loading()}
                                onKeyDown={press}
                                value={displayName()}
                                onChange={v => setDisplayName((v.target as HTMLInputElement).value)}
                            />
                            <Input
                                placeholder={translate(lang(), "USERNAME")}
                                loading={loading()}
                                onKeyDown={press}
                                value={username()}
                                onChange={v => setUsername((v.target as HTMLInputElement).value)}
                            />
                            <Input
                                placeholder={translate(lang(), "EMAIL")}
                                loading={loading()}
                                onKeyDown={press}
                                value={email()}
                                onChange={v => setEmail((v.target as HTMLInputElement).value)}
                            />
                            <Input 
                                password={true}
                                placeholder={translate(lang(), "PASSWORD")} 
                                loading={loading()} 
                                onKeyDown={press} 
                                value={password()} 
                                onChange={v => setPassword((v.target as HTMLInputElement).value)} 
                            />
                            <Button onClick={register} disabled={loading()}>{translate(lang(), "CONTINUE")}</Button>
                        </div>
                        <p>
                            {translate(lang(), "HAVE_AN_ACCOUNT")} <Link href="javascript:void(0)" onClick={login}>{translate(lang(), "LOGIN")}</Link>
                        </p>
                        <ErrorText>
                            {error() && translate(lang(), error()!)}
                        </ErrorText>
                    </Fade>
                </Match>
                <Match when={stage() === "verify"}>
                    <Fade hiding={hiding()}>
                        <Title>{translate(lang(), "VERIFICATION")}</Title>
                        <div>
                            <Box type="success">
                                <p>{translate(lang(), "VERIFICATION_DESCRIPTION")}</p>
                            </Box>
                            <Box type="information">
                                <HCaptcha 
                                    config={{ hl: lang() }}
                                    theme="light"
                                    sitekey={CAPTCHA_KEY}
                                    onVerify={setCaptchaToken}
                                    ref={captcha}
                                    onLoad={initCaptcha}
                                />
                            </Box>
                            <ButtonContainer>
                                <Button onClick={back} disabled={loading()}>{translate(lang(), "BACK")}</Button>
                                <Button onClick={register} disabled={loading()}>{translate(lang(), "CONTINUE")}</Button>
                            </ButtonContainer>
                        </div>
                        <ErrorText>
                        {error() && translate(lang(), error()!)}
                        </ErrorText>
                    </Fade>
                </Match>
                <Match when={stage() === "done"}>
                    <Fade hiding={hiding()}>
                        <Title>{translate(lang(), "CONTINUE")}</Title>
                        <div>
                            <label>{translate(lang(), "LOGGED_IN")}</label>
                        </div>
                        <ErrorText />
                    </Fade>
                </Match>
                <Match when={stage() === "skip"}>
                    
                    <Fade hiding={hiding()}>
                        <Title>{translate(lang(), "CONTINUE")}</Title>
                        <div>
                            <label>{translate(lang(), "ALREADY_LOGGED_IN")}</label>
                        </div>
                        <ErrorText />
                    </Fade>
                </Match>
            </Switch>
        </Show>
    );
};

export default Register;
