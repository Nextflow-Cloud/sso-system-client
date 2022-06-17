import { useEffect, useRef, useState } from "preact/hooks";
import i18n from "../utilities/i18n";
import { useNavigate } from "react-router-dom";
import FormBase from "../components/FormBase";
import Button from "../components/primitive/Button";

const App = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState("email");
    const fade = useRef<HTMLDivElement>(null);
    const submit = useRef<HTMLDivElement>(null);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [continueToken, setContinueToken] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [persist, setPersist] = useState(false);
    const [checked, setChecked] = useState(false);
    const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");
    
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

            const request = await Promise.race([fetch("https://secure.nextflow.cloud/api/login", {
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
            if (fade.current) fade.current.style.animation = "1s fadeOutLeft";
            await new Promise(r => setTimeout(r, 1000));
            setStage("password");
            if (fade.current) fade.current.style.animation = "1s fadeInRight";          
        } else if (stage === "password") {
            if (!password.trim()) {
                setError("Password is blank");
                return;
            }
            setLoading(true);
            
            const request = await Promise.race([fetch("https://secure.nextflow.cloud/api/login", {
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
                    if (fade.current) fade.current.style.animation = "1s fadeOutLeft";
                    await new Promise(r => setTimeout(r, 1000));
                    setStage("email");
                    setError("Hmm, you seem to have waited too long to log in. Please try again.");
                    // setError("Your email or password is incorrect. Please try again.");
                    if (fade.current) fade.current.style.animation = "1s fadeInRight";
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
                if (fade.current) fade.current.style.animation = "1s fadeOutLeft";
                await new Promise(r => setTimeout(r, 1000));
                setStage("2fa");
                if (fade.current) fade.current.style.animation = "1s fadeInRight";
            } else {
                setToken(response.token);
                setLoading(false);
                if (fade.current) fade.current.style.animation = "1s fadeOutLeft";
                await new Promise(r => setTimeout(r, 1000));
                setStage("done");
                if (fade.current) fade.current.style.animation = "1s fadeInRight";
            }
        } else if (stage === "2fa") {
            if (!code.trim()) {
                setError("2FA code is blank");
                return;
            }
            if (code.length !== 6) { 
                setError("2FA code is not 6 digits");
                return;
            }
            if (!code.trim().match(/^\d+$/)) {
                setError("2FA code is not a number");
                return;
            }
            setLoading(true);
            const request = await Promise.race([fetch("https://secure.nextflow.cloud/api/login", {
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
                    if (fade.current) fade.current.style.animation = "1s fadeOutLeft";
                    await new Promise(r => setTimeout(r, 1000));
                    setStage("email");
                    setError("Hmm, you seem to have waited too long to log in. Please try again.");
                    if (fade.current) fade.current.style.animation = "1s fadeInRight";
                }
                if (request.status === 429) {
                    console.error("[ERROR] Rate limited");
                    setError("Whoa there, chill out. You seem to be logging in too quickly.");
                }
                return;
            }
            const response = await request.json();
            console.log("[LOG] Login response: ", response);
            setToken(response.token);
            
            setLoading(false);
            if (fade.current) fade.current.style.animation = "1s fadeOutLeft";
            await new Promise(r => setTimeout(r, 1000));
            setStage("done");
            if (fade.current) fade.current.style.animation = "1s fadeInRight";

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            localStorage.setItem("token", token!);
            setTimeout(() => {
                const getContinueUrl = new URLSearchParams(window.location.search).get("continue");
                const url = new URL(getContinueUrl ? getContinueUrl : "https://nextflow.cloud");
                if (getContinueUrl === "nextpass://auth") {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    url.searchParams.set("token", localStorage.getItem("token")!);
                }
                // url.searchParams.set("token", token);
                window.location.href = url.toString();
            }, 1000);
        } else if (stage === "done") {
            // continue to destination
            setError("");
        }
        
    };
    const press = (e: KeyboardEvent) => {      
        if (e.key === "Enter") {
            console.log(submit.current?.click);
            submit.current?.click();
        }  
    };
    const checkToken = async () => {
        if (token) {
            const r = await fetch("https://secure.nextflow.cloud/api/validate", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                }, 
                body: JSON.stringify({
                    token
                })
            });
            if (r.ok) {
                setStage("skip");
                setTimeout(() => {
                    const getContinueUrl = new URLSearchParams(window.location.search).get("continue");
                    const url = new URL(getContinueUrl ? getContinueUrl : "https://nextflow.cloud");
                    if (getContinueUrl === "nextpass://auth") {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        url.searchParams.set("token", localStorage.getItem("token")!);
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
    const register = () => {
        const continueUrl = new URLSearchParams(window.location.search).get("continue");
        const href = continueUrl ? `/register?continue=${encodeURIComponent(continueUrl)}` : "/register";
        navigate(href);
    };
    if (!checked) {
        return <div />;
    }
    if (stage === "email") {
        return (
            <FormBase loading={loading} setLang={setLang} lang={lang}>
                <div ref={fade} style={{
                    animation: "1s fadeInRight"
                }}>
                    <h1 className="text-3xl mb-5"><b>{i18n.translate(lang, "login")}</b></h1>
                    <div className="inside">  
                        <label><b>{i18n.translate(lang, "email")}</b></label>
                        <div className='my-1'>
                            <input 
                                className="w-full p-2 border-gray-200 border rounded-md hover:border-green-400 mb-2 focus:border-green-400" 
                                type="text" 
                                placeholder={i18n.translate(lang, "enterEmail")} 
                                disabled={loading} 
                                onKeyDown={press} 
                                value={email} 
                                onChange={v => setEmail((v.target as HTMLInputElement).value)} 
                            />
                        </div>
                        <Button onClick={login} divRef={submit} disabled={loading}>{i18n.translate(lang, "next")}</Button>
                    </div>
                    <div className="inside" />
                    <p className="inside">
                        {i18n.translate(lang, "noAccount")} <a href="javascript:void(0)" onClick={register} class="text-blue-600">{i18n.translate(lang, "register")}</a>
                    </p>
                    <p className='inside error'>
                        {error}
                    </p>
                </div>
            </FormBase>
        );
    } if (stage === "password") {
        return (
            <FormBase loading={loading} setLang={setLang} lang={lang}>
                <div ref={fade} style={{
                    animation: "1s fadeInRight"
                }}>
                    <h1 className="text-3xl mb-5"><b>{i18n.translate(lang, "login")}</b></h1>

                    <div className="inside">
                        <label><b>{i18n.translate(lang, "password")}</b></label>
                        <div className='my-1'>
                            <input className="w-full p-2 border-gray-200 border rounded-md hover:border-green-400 mb-2" type="password" placeholder={i18n.translate(lang, "enterPassword")}  disabled={loading} onKeyDown={press} value={password} onChange={v => setPassword((v.target as HTMLInputElement).value)} />
                        </div>
                        <Button onClick={login} divRef={submit} disabled={loading}>{i18n.translate(lang, "next")}</Button>
                    </div>
                    <div className="inside">
                        <label><input checked={persist} onChange={v => setPersist((v.target as HTMLInputElement).checked)} type="checkbox" label="" /> {i18n.translate(lang, "staySignedIn")}</label>
                    </div>
                    <p className="inside">
                        <a href="/forgot" onClick={e => {
                            e.preventDefault();
                            navigate("/forgot");
                        }}>{i18n.translate(lang, "forgot")}</a>
                    </p>
                    <p className='inside error'>
                        {error}
                    </p>
                </div>
            </FormBase>
        );
    } if (stage === "2fa") {
        return (
            <FormBase loading={loading} setLang={setLang} lang={lang}>
                <div ref={fade} style={{
                    animation: "1s fadeInRight"
                }}>
                    <h1 className="text-3xl mb-5"><b>{i18n.translate(lang, "twoFactorAuthentication")}</b></h1>
                    <div className="inside">  
                        <label><b>{i18n.translate(lang, "enterCodeDescription")}</b></label>
                        <input 
                            className="w-full p-2 border-gray-200 border rounded-md hover:border-green-400 mb-2" 
                            type="text" placeholder={i18n.translate(lang, "enterCode")}
                            disabled={loading} 
                            onKeyDown={press} 
                            value={code} 
                            onChange={v => setCode((v.target as HTMLInputElement).value)} 
                        />
                        <Button onClick={login} divRef={submit} disabled={loading}>{i18n.translate(lang, "next")}</Button>
                    </div>
                    <div className="inside" />
                    <p className='inside error'>
                        {error}
                    </p>
                </div>
            </FormBase>
        );
    } if (stage === "done") {
        return (
            <FormBase loading={loading} setLang={setLang} lang={lang}>
                <div ref={fade} style={{
                    animation: "1s fadeInRight"
                }}>
                    <h1 className="text-3xl mb-5"><b>{i18n.translate(lang, "continue")}</b></h1>
                    <div className="inside">  
                        <label>{i18n.translate(lang, "loggedIn")}</label>
                    </div>
                    <p className='inside error'>
                        {error}
                    </p>
                </div>
            </FormBase>
        );
    } if (stage === "skip") { 
        return (
            <FormBase loading={loading} setLang={setLang} lang={lang}>
                <div ref={fade} style={{
                    animation: "1s fadeInRight"
                }}>
                    <h1 className="text-3xl mb-5"><b>{i18n.translate(lang, "continue")}</b></h1>
                    <div className="inside">
                        <label>{i18n.translate(lang, "alreadyLoggedIn")}</label>
                    </div>
                    <p className='inside error'>
                        {error}
                    </p>
                </div>
            </FormBase>
        );
    }
    return <div />;
};

export default App;

