import { Accessor, createSignal, JSX, Match, onMount, Setter, Show } from "solid-js";
import Fade from "../components/Fade";
import { Language, translate } from "../utilities/i18n";
import ErrorText from "../components/ErrorText";
import Title from "../components/primitive/Title";
import Input from "../components/primitive/Input";
import Button from "../components/primitive/Button";
import Link from "../components/primitive/Link";
import Switch from "../components/primitive/Switch";
// import { createSessionPasskey } from "../utilities/lib/authenticationExperimental";
import { Switch as ConditionalSwitch } from "solid-js";
import { createSession, PartialClient, SessionError, SessionErrorType, validateSession } from "../utilities/lib/authentication";
import OtpInput from "../components/primitive/OtpInput";
import { useNavigate } from "@solidjs/router";
import { TRUSTED_SERVICES } from "../constants";

type LoginStage = "credentials" | "2fa" | "done" | "skip";
type InputError = "EMPTY_EMAIL" | "INVALID_EMAIL" | "EMPTY_PASSWORD" | "EMPTY_CODE" | "INVALID_CODE";

const Login = ({ loading, setLoading, lang }: { loading: Accessor<boolean>; setLoading: Setter<boolean>; lang: Accessor<Language>; }) => {
    const [error, setError] = createSignal<SessionErrorType | InputError>();
    const [stage, setStage] = createSignal<LoginStage>("credentials");
    const [checked, setChecked] = createSignal(false);

    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [code, setCode] = createSignal("");
    const [persist, setPersist] = createSignal(false);
    const [partialSession, setPartialSession] = createSignal<PartialClient>();

    const [hiding, setHiding] = createSignal(false);

    const navigate = useNavigate();

    const login = async () => {
        setError();
        if (stage() === "credentials") {
            if (!email().trim()) {
                setError("EMPTY_EMAIL");
                return;
            }
            // TODO:
            const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
            const match = email().trim().match(emailRegex);
            if (!match || match.length !== 1) {
                setError("INVALID_EMAIL");
                return;
            }
            if (!password().trim()) {
                setError("EMPTY_PASSWORD");
                return;
            }
            setLoading(true);
            setEmail(match[0]);
            try {
                const session = await createSession(email().trim(), password(), persist());
                if (session.needsContinuation()) {
                    setPartialSession(session);
                    await switchStage("2fa");
                } else {
                    await switchStage("done");
                    localStorage.setItem("token", session.token);
                    await continueToRegisteredService(session.token);
                }
            } catch (e) {
                setError((e as SessionError).toString());
                setLoading(false);
            }
        } else if (stage() === "2fa") {
            if (!code()) {
                setError("EMPTY_CODE");
                return;
            }
            if (code().length !== 8) {
                setError("INVALID_CODE");
                return;
            }
            setLoading(true);
            try {
                const session = await partialSession()!.continue(code());
                await switchStage("done");
                localStorage.setItem("token", session.token);
                await continueToRegisteredService(session.token);
            } catch (e) {
                const error = (e as SessionError).toString();
                setError(error === "INVALID_CREDENTIALS" ? "INVALID_CODE" : error);
                setLoading(false);
            }
        }
    };

    const switchStage = async (stage: LoginStage) => {
        setLoading(false);
        setHiding(true);
        await new Promise(r => setTimeout(r, 1000));
        setStage(stage);
        setHiding(false);
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

    const register: JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent> = (e) => {
        e.preventDefault();
        const continueUrl = new URLSearchParams(window.location.search).get("continue");
        const href = continueUrl ? `/register?continue=${encodeURIComponent(continueUrl)}` : "/register";
        navigate(href);
    };
    const forgot: JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent> = (e) => {
        e.preventDefault();
        navigate("/forgot");
    };

    const press = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            login();
        }
    };

    // TODO: don't copy this code
    const checkToken = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const session = await validateSession(token);
            if (session) {
                // however, need to handle this somehow
                setStage("skip");
                await continueToRegisteredService(token);
            }
        }
        setChecked(true);
    };

    onMount(() => {
        checkToken();
    });
                
    return (
        <Show when={checked()} fallback={<div />}>
            <ConditionalSwitch fallback={<div />}>
                <Match when={stage() === "credentials"}>
                    <Fade hiding={hiding()}>
                        <Title>{translate(lang(), "LOGIN")}</Title>
                        {/* <div>
                            <Button onClick={createSessionPasskey} disabled={loading()}>{translate(lang(), "LOGIN_WITH_PASSKEY")}</Button>
                        </div>
                        <span style={{ "align-self": "center"}}>OR</span> */}
                        <div>
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
                            <Switch checked={persist} setChecked={setPersist} /> {translate(lang(), "STAY_SIGNED_IN")}
                            
                            <Button onClick={login} disabled={loading()}>{translate(lang(), "CONTINUE")}</Button>
                        </div>
                        <p>
                            {translate(lang(), "NO_ACCOUNT")} <Link href="/register" onClick={register}>{translate(lang(), "REGISTER")}</Link>
                            </p><p>
                            <Link href="/forgot" onClick={forgot}>{translate(lang(), "FORGOT")}</Link>
                        </p>
                        <ErrorText>
                            {error() && translate(lang(), error()!)}
                        </ErrorText>
                    </Fade>
                </Match>
                <Match when={stage() === "2fa"}>
                    <Fade hiding={hiding()}>
                        <Title>{translate(lang(), "TWO_FACTOR")}</Title>
                        <div>
                            <label>{translate(lang(), "ENTER_CODE")}</label> 
                            <OtpInput code={code} setCode={setCode} />
                            <Button onClick={login} disabled={loading()}>{translate(lang(), "CONTINUE")}</Button>
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
                            <label>
                                {translate(lang(), "LOGGED_IN")}
                            </label>
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
            </ConditionalSwitch>
        </Show>
    )
};

export default Login;
