// const Login = () => {
//     return (
//         <div>
//             <div>
//                 <h1>Login</h1>
//             </div>
//             <h1 class="text-red-500">I'm a login page. Yay!</h1>
//         </div>
//     );
// };

// export default Login;

// this still has way too many errors because I copied this from a JS file
// I need to fix all the TypeErrors

import { useEffect, useRef, useState } from "preact/hooks";
// import { Button, Input, Form, Switch } from "antd";
// import Footer from "../components/Footer";
import i18n from "../utilities/i18n";
import { useNavigate } from "react-router-dom";
import FormBase from "../components/FormBase";

const App = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState("email");
    // const [fade, setFade] = useState<HTMLDivElement | null>(null);
    // const [submit, setSubmit] = useState<HTMLDivElement | null>(null);
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
            await new Promise(r => setTimeout(r, 900));
            setStage("password");
            if (fade.current) fade.current.style.animation = ""; // I would put fade && but ESLint doesn't like it so I guess this will do           
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
                    await new Promise(r => setTimeout(r, 900));
                    setStage("email");
                    setError("Hmm, you seem to have waited too long to log in. Please try again.");
                    // setError("Your email or password is incorrect. Please try again.");
                    if (fade.current) fade.current.style.animation = "";
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
                await new Promise(r => setTimeout(r, 900));
                setStage("2fa");
                if (fade.current) fade.current.style.animation = "";
            } else {
                setToken(response.token);
                setLoading(false);
                if (fade.current) fade.current.style.animation = "1s fadeOutLeft";
                await new Promise(r => setTimeout(r, 900));
                setStage("done");
                if (fade.current) fade.current.style.animation = "";
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
                    await new Promise(r => setTimeout(r, 900));
                    setStage("email");
                    setError("Hmm, you seem to have waited too long to log in. Please try again.");
                    if (fade.current) fade.current.style.animation = "";
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
            await new Promise(r => setTimeout(r, 900));
            setStage("done");
            if (fade.current) fade.current.style.animation = "";

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
            (submit.current as unknown as HTMLButtonElement).click();   
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
            // // eslint-disable-next-line no-debugger
            // debugger;
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
    // // eslint-disable-next-line no-debugger
    // debugger;
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
                        {/* <Input type={"email"} disabled={loading} placeholder="Enter email" onKeyDown={press} value={email} onChange={v => setEmail(v.target.value)}></Input> */}
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
                        <div className='btnNext rounded-lg bg-green-500 hover:bg-opacity-60 p-2 text-white text-center' onClick={login} ref={submit}>{i18n.translate(lang, "next")}</div>
                    </div>
                    <div className="inside">
                        {/* <Button type="primary" shape="round" onClick={login} loading={loading} ref={node => setSubmit(node)}>Next</Button> */}
                    </div>
                    <p className="inside">
                        {i18n.translate(lang, "noAccount")} <a onClick={register}>{i18n.translate(lang, "register")}</a>
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
                        <div className='btnNext rounded-lg bg-green-500 hover:bg-opacity-60 p-2 text-white text-center' onClick={login} ref={submit}>{i18n.translate(lang, "next")}</div>
                        {/* <Input type={"password"} placeholder="Enter password" onKeyDown={press} value={password} onChange={v => setPassword(v.target.value)}></Input> */}
                    </div>
                    <div className="inside">
                        <input checked={persist} onChange={v => setPersist((v.target as HTMLInputElement).checked)} />
                        <label> {i18n.translate(lang, "staySignedIn")}</label>
                        {/* <br />
                        <br />
                        <Button type="primary" shape="round" onClick={login} loading={loading} ref={node => setSubmit(node)}>Next</Button> */}
                    </div>
                    <p className="inside">
                        <a href="/forgot">{i18n.translate(lang, "forgot")}</a>
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
                        <label><b>{i18n.translate(lang, "english")} - {i18n.translate(lang, "enterCodeDescription")}</b></label>
                        {/* <Input type={"text"} placeholder={i18n[lang].enterCode} onKeyDown={press} value={code} onChange={v => setCode(v.target.value)}></Input> */}
                        <input 
                            className="w-full p-2 border-gray-200 border rounded-md hover:border-green-400 mb-2" 
                            type="text" placeholder={i18n.translate(lang, "enterCode")}
                            disabled={loading} 
                            onKeyDown={press} 
                            value={code} 
                            onChange={v => setCode((v.target as HTMLInputElement).value)} 
                        />
                        <div className='btnNext rounded-lg bg-green-500 hover:bg-opacity-60 p-2 text-white text-center' onClick={login} ref={submit}>{i18n.translate(lang, "next")}</div>
                    </div>
                    <div className="inside">
                        {/* <Button type="primary" shape="round" onClick={login} loading={loading} ref={node => setSubmit(node)}>Log in</Button> */}
                    </div>
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

