import { JSX } from "preact";
import { StateUpdater, useEffect, useState } from "preact/hooks";
import i18n from "../utilities/i18n";
import { useNavigate } from "react-router-dom";
import Button from "../components/primitive/Button";
import Input from "../components/primitive/Input";
import Title from "../components/primitive/Title";
import Link from "../components/primitive/Link";
import Fade from "../components/Fade";
import ErrorText from "../components/ErrorText";
import { TRUSTED_SERVICES } from "../constants";

type LoginStage = "email" | "password" | "2fa" | "done" | "skip";

const Login = ({ loading, setLoading, lang }: { loading: boolean; setLoading: StateUpdater<boolean>; lang: string; }) => {
    const [error, setError] = useState("");
    const [stage, setStage] = useState<LoginStage>("email");
    const [checked, setChecked] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [persist, setPersist] = useState(false);
    const [continueToken, setContinueToken] = useState("");

    const [hiding, setHiding] = useState(false);

    const navigate = useNavigate();

    const login = async () => {
        setError("");
        if (stage === "email") {
            if (!email.trim()) {
                setError("Email is blank");
                return;
            }
            // eslint-disable-next-line no-control-regex
            const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
            const match = email.trim().match(emailRegex);
            if (!match || match.length !== 1) {
                setError("Invalid email");
                return;
            }
            setLoading(true);
            setEmail(match[0]);
            const request = await Promise.race([fetch("/api/session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    stage: 1,
                    email
                })
            }), new Promise(r => setTimeout(r, 5000))]);
            await new Promise(r => setTimeout(r, 500));
            if (!(request instanceof Response)) {
                console.error("[ERROR] Server timed out");
                setError("Server timed out");
                setLoading(false);
                return;
            }
            if (!request.ok) {
                console.error(`[ERROR] Server returned status code ${request.status}`);
                setError(`Server returned status code ${request.status}`);
                setLoading(false);
                if (request.status === 401) {
                    console.error("[ERROR] Invalid email");
                    setError("There is no account with that email. Did you make a typo?");
                }
                if (request.status === 429) {
                    console.error("[ERROR] Rate limited");
                    setError("Whoa there, chill out. You seem to be logging in too quickly.");
                }
                return;
            }
            const response = await request.json();
            console.log("[LOG] Login response: ", response);
            setContinueToken(response.continueToken);
            setLoading(false);
            setHiding(true);
            await new Promise(r => setTimeout(r, 1000));
            setStage("password");
            setHiding(false);
        } else if (stage === "password") {
            if (!password.trim()) {
                setError("Password is blank");
                return;
            }
            setLoading(true);
            const request = await Promise.race([fetch("/api/session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    stage: 2,
                    continueToken,
                    password,
                    persist
                })
            }), new Promise(r => setTimeout(r, 5000))]);
            await new Promise(r => setTimeout(r, 500));
            if (!(request instanceof Response)) {
                console.error("[ERROR] Server timed out");
                setError("Server timed out");
                setLoading(false);
                return;
            }
            if (!request.ok) {
                console.error(`[ERROR] Server returned status code ${request.status}`);
                setError(`Server returned status code ${request.status}`);
                setLoading(false);
                if (request.status === 401) {
                    console.error("[ERROR] Invalid password");
                    setError("The password is incorrect. Did you make a typo?");
                }
                if (request.status === 403) {
                    console.error("[ERROR] Session expired");
                    setHiding(true);
                    await new Promise(r => setTimeout(r, 1000));
                    setStage("email");
                    setError("Hmm, you seem to have waited too long to log in. Please try again.");
                    // setError("Your email or password is incorrect. Please try again.");
                    setHiding(false);
                }
                if (request.status === 429) {
                    console.error("[ERROR] Rate limited");
                    setError("Whoa there, chill out. You seem to be logging in too quickly.");
                }
                return;
            }
            const response = await request.json();
            console.log("[LOG] Login response: ", response);
            if (response.mfaEnabled) {
                setContinueToken(response.continueToken);
                setLoading(false);
                setHiding(true);
                await new Promise(r => setTimeout(r, 1000));
                setStage("2fa");
                setHiding(false);
            } else {
                setLoading(false);
                setHiding(true);
                await new Promise(r => setTimeout(r, 1000));
                setStage("done");
                setHiding(false);

                localStorage.setItem("token", response.token);
                setTimeout(() => {
                    const continueUrl = new URLSearchParams(location.search).get("continue");
                    const url = new URL(continueUrl ? continueUrl : "https://nextflow.cloud");
                    if (continueUrl === "nextpass://auth") {
                        url.searchParams.set("token", localStorage.getItem("token") as string);
                    }
                    // url.searchParams.set("token", token);
                    location.href = url.toString();
                }, 1000);
            }
        } else if (stage === "2fa") {
            if (!code.trim()) {
                setError("2FA code is blank");
                return;
            }
            if (code.length !== 8) {
                setError("2FA code is not 8 digits");
                return;
            }
            if (!code.trim().match(/^\d+$/)) {
                setError("2FA code is not a number");
                return;
            }
            setLoading(true);
            const request = await Promise.race([fetch("/api/session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    stage: 3,
                    continueToken,
                    code,
                    password
                })
            }), new Promise(r => setTimeout(r, 5000))]);
            await new Promise(r => setTimeout(r, 500));
            if (!(request instanceof Response)) {
                console.error("[ERROR] Server timed out");
                setError("Server timed out");
                setLoading(false);
                return;
            }
            if (!request.ok) {
                console.error(`[ERROR] Server returned status code ${request.status}`);
                setError(`Server returned status code ${request.status}`);
                setLoading(false);
                if (request.status === 401) {
                    console.error("[ERROR] Invalid 2FA code");
                    setError("The 2FA code is incorrect. Did you make a typo?");
                }
                if (request.status === 403) {
                    console.error("[ERROR] Session expired");
                    setHiding(true);
                    await new Promise(r => setTimeout(r, 1000));
                    setStage("email");
                    setError("Hmm, you seem to have waited too long to log in. Please try again.");
                    setHiding(false);
                }
                if (request.status === 429) {
                    console.error("[ERROR] Rate limited");
                    setError("Whoa there, chill out. You seem to be logging in too quickly.");
                }
                return;
            }
            const response = await request.json();
            console.log("[LOG] Login response: ", response);
            setLoading(false);
            setHiding(true);
            await new Promise(r => setTimeout(r, 1000));
            setStage("done");
            setHiding(false);
            localStorage.setItem("token", response.token);
            setTimeout(() => {
                const getContinueUrl = new URLSearchParams(window.location.search).get("continue");
                const url = new URL(getContinueUrl ? getContinueUrl : TRUSTED_SERVICES[0]);
                if (TRUSTED_SERVICES.some(x => x === url.origin + url.pathname)) {
                    url.searchParams.set("token", response.token);
                }
                window.location.href = url.toString();
            }, 1000);
        }
    };

    const register = (e: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const continueUrl = new URLSearchParams(window.location.search).get("continue");
        const href = continueUrl ? `/register?continue=${encodeURIComponent(continueUrl)}` : "/register";
        navigate(href);
    };
    const forgot = (e: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate("/forgot");
    };

    const press = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            login();
        }
    };

    const checkToken = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const r = await fetch("/api/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token })
            });
            if (r.ok) {
                setStage("skip");
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
        setChecked(true);
    };

    useEffect(() => {
        checkToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!checked) {
        return <div />;
    }
    if (stage === "email") {
        return (
            <Fade hiding={hiding}>
                <Title>{i18n.translate(lang, "login")}</Title>
                <div>
                    <label>{i18n.translate(lang, "email")}</label>
                    <Input
                        placeholder={i18n.translate(lang, "enterEmail")}
                        loading={loading}
                        onKeyDown={press}
                        value={email}
                        onChange={v => setEmail((v.target as HTMLInputElement).value)}
                    />
                    <Button onClick={login} disabled={loading}>{i18n.translate(lang, "next")}</Button>
                </div>
                <p>
                    {i18n.translate(lang, "noAccount")} <Link href="/register" onClick={register}>{i18n.translate(lang, "register")}</Link>
                </p>
                <ErrorText>
                    {error}
                </ErrorText>
            </Fade>
        );
    }
    if (stage === "password") {
        return (
            <Fade hiding={hiding}>
                <Title>{i18n.translate(lang, "login")}</Title>
                <div>
                    <label>{i18n.translate(lang, "password")}</label>
                    <Input 
                        password={true}
                        placeholder={i18n.translate(lang, "enterPassword")} 
                        loading={loading} 
                        onKeyDown={press} 
                        value={password} 
                        onChange={v => setPassword((v.target as HTMLInputElement).value)} 
                    />
                    <Button onClick={login} disabled={loading}>{i18n.translate(lang, "next")}</Button>
                    <label><input checked={persist} onChange={v => setPersist((v.target as HTMLInputElement).checked)} type="checkbox" label="" /> {i18n.translate(lang, "staySignedIn")}</label>
                </div>
                <p>
                    <Link href="/forgot" onClick={forgot}>{i18n.translate(lang, "forgot")}</Link>
                </p>
                <ErrorText>
                    {error}
                </ErrorText>
            </Fade>
        );
    }
    if (stage === "2fa") {
        return (
            <Fade hiding={hiding}>
                <Title>{i18n.translate(lang, "twoFactorAuthentication")}</Title>
                <div>
                    <label>{i18n.translate(lang, "enterCodeDescription")}</label>
                    <Input
                        placeholder={i18n.translate(lang, "enterCode")}
                        loading={loading}
                        onKeyDown={press}
                        value={code}
                        onChange={v => setCode((v.target as HTMLInputElement).value)}
                    />
                    <Button onClick={login} disabled={loading}>{i18n.translate(lang, "next")}</Button>
                </div>
                <ErrorText>
                    {error}
                </ErrorText>
            </Fade>
        );
    }
    if (stage === "done") {
        return (
            <Fade hiding={hiding}>
                <Title>{i18n.translate(lang, "continue")}</Title>
                <div>
                    <label>{i18n.translate(lang, "loggedIn")}</label>
                </div>
                <ErrorText>
                    {error}
                </ErrorText>
            </Fade>
        );
    }
    if (stage === "skip") {
        return (
            <Fade hiding={hiding}>
                <Title>{i18n.translate(lang, "continue")}</Title>
                <div>
                    <label>{i18n.translate(lang, "alreadyLoggedIn")}</label>
                </div>
                <ErrorText>
                    {error}
                </ErrorText>
            </Fade>
        );
    }

    return <div />;
};

export default Login;
