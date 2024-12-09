import { Accessor, createSignal, JSX, Match, onMount, Setter, Show } from "solid-js";
import Fade from "../components/Fade";
import { Language, translate } from "../utilities/i18n";
import ErrorText from "../components/ErrorText";
import Title from "../components/primitive/Title";
import Input from "../components/primitive/Input";
import Button from "../components/primitive/Button";
import Link from "../components/primitive/Link";
import { Switch as ConditionalSwitch } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { TRUSTED_SERVICES } from "../constants";
import { calculateEntropy } from "../utilities/client";
import { validateSession } from "../utilities/lib/login";
import { finishResetPassword, forgotPassword } from "../utilities/lib/forgot";
import { ClientError, ClientErrorType } from "../utilities/lib/errors";

type ForgotStage = "email" | "sent" | "credentials" | "done" | "skip";
type InputError = "EMPTY_EMAIL" | "INVALID_EMAIL" | "EMPTY_PASSWORD" | "INVALID_CREDENTIALS" | "WEAK_PASSWORD";

const Forgot = ({ loading, setLoading, lang }: { loading: Accessor<boolean>; setLoading: Setter<boolean>; lang: Accessor<Language>; }) => {
    const [error, setError] = createSignal<ClientErrorType | InputError>();
    const [stage, setStage] = createSignal<ForgotStage>("email");
    const [checked, setChecked] = createSignal(false);

    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [confirmPassword, setConfirmPassword] = createSignal("");

    const [hiding, setHiding] = createSignal(false);
    
    const navigate = useNavigate();

    const forgot = async () => {
        setError();
        if (stage() === "email") {
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
            setLoading(true);
            setEmail(match[0]);
            try {
                await forgotPassword(email());
                await switchStage("sent");
                setLoading(false);
            } catch (e) {
                setError((e as ClientError).toString());
                setLoading(false);
            }
        } else if (stage() === "credentials") {   
            if (password() !== confirmPassword()) {
                setError("INVALID_CREDENTIALS");
                return;
            }         
            const entropy = calculateEntropy(password());
            if (entropy < 64) {
                setError("WEAK_PASSWORD");
                return;
            }
            const token = new URLSearchParams(location.search).get("token");
            try {
                await finishResetPassword(password(), token!);
                await switchStage("done");
                setLoading(false);
            } catch (e) {
                setError((e as ClientError).toString());
                setLoading(false);
            }
        }
    };

    const switchStage = async (stage: ForgotStage) => {
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
                    console.log(token);
                    url.searchParams.set("token", token);
                }
                window.location.href = url.toString();
            }, 1000);
        }
    }
    const login: JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent> = (e) => {
        e.preventDefault();
        navigate("/login");
    };

    const press = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            forgot();
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
                console.log("skipping login", token);
                await continueToRegisteredService(token);
            }
        }
        setChecked(true);
        const search = new URLSearchParams(location.search).get("token");
        if (search) {
            setStage("credentials");
        }
    };

    onMount(() => {
        checkToken();
    });
                
    return (
        <Show when={checked()} fallback={<div />}>
            <ConditionalSwitch fallback={<div />}>
                <Match when={stage() === "email"}>
                    <Fade hiding={hiding()}>
                        <Title>{translate(lang(), "FORGOT")}</Title>
                        <div>
                            <Input
                                placeholder={translate(lang(), "EMAIL")}
                                loading={loading()}
                                onKeyDown={press}
                                value={email()}
                                onChange={v => setEmail((v.target as HTMLInputElement).value)}
                            />
                            <Button onClick={forgot} disabled={loading()}>{translate(lang(), "CONTINUE")}</Button>
                        </div>
                        <p>
                            <Link href="/login" onClick={login}>{translate(lang(), "LOGIN")}</Link>
                        </p>
                        <ErrorText>
                            {error() && translate(lang(), error()!)}
                        </ErrorText>
                    </Fade>
                </Match>
                <Match when={stage() === "sent"}>
                    <Fade hiding={hiding()}>
                        <Title>{translate(lang(), "FORGOT")}</Title>
                        <div>
                            <label>
                                If there is an account associated with that email address, we will send you an email with a link to continue the process.
                            </label>
                        </div>
                        <ErrorText />
                    </Fade>
                </Match>
                <Match when={stage() === "credentials"}>
                    <Fade hiding={hiding()}>
                        <Title>{translate(lang(), "FORGOT")}</Title>
                        <div>
                            <Input
                                placeholder={translate(lang(), "PASSWORD")}
                                loading={loading()}
                                onKeyDown={press}
                                value={password()}
                                onChange={v => setPassword((v.target as HTMLInputElement).value)}
                                password
                            />
                            <Input
                                placeholder={translate(lang(), "CONFIRM_PASSWORD")}
                                loading={loading()}
                                onKeyDown={press}
                                value={confirmPassword()}
                                onChange={v => setConfirmPassword((v.target as HTMLInputElement).value)}
                                password
                            />
                            <Button onClick={forgot} disabled={loading()}>{translate(lang(), "CONTINUE")}</Button>
                        </div>
                        <ErrorText>
                            {error() && translate(lang(), error()!)}
                        </ErrorText>
                    </Fade>
                </Match>
                <Match when={stage() === "done"}>
                    <Fade hiding={hiding()}>
                        <Title>{translate(lang(), "FORGOT")}</Title>
                        <div>
                            <label>
                                Your password has been successfully reset.
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

export default Forgot;
