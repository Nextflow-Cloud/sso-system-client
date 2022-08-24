import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useEffect, useRef, useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import i18n from "../utilities/i18n";
import Button from "../components/primitive/Button";
import FormBase from "../components/FormBase";
import createProtectedRequest from "../utilities/createProtectedRequest";

const captchaKey = "a57a57d4-6845-48a7-b89a-46b130e90f47";

// const generateSecurityKeys = (password: string) => {
//     // const salt = crypto.getRandomValues(new Uint8Array(16));
//     // const key = crypto.subtle.importKey("raw", password, "PBKDF2", false, ["deriveKey"]);
//     // return crypto.subtle.deriveKey({
//     //     name: "PBKDF2",
//     //     salt,
//     //     iterations: 100000,
//     //     hash: "SHA-256"
//     // }, key, {
//     //     name: "AES-GCM",
//     //     length: 256
//     // }, false, ["encrypt", "decrypt"]);
//     return password; // dummy for now before we actually generate keys
// };

const Register = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState("details");
    const [checked, setChecked] = useState(false);
    const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");

    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [code, setCode] = useState("");
    const [captchaToken, setCaptchaToken] = useState("");
    // const [continueToken, setContinueToken] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token"));

    // const [mfaSecret, setMfaSecret] = useState(""); // link to base64 image of QR code
    // const [backupFile, setBackupFile] = useState("");

    // const [superSecureMode, setSuperSecureMode] = useState(true);
    // const [tiEncryption, setTiEncryption] = useState(true);
    // const [iaEncryption, setIaEncryption] = useState(true);
    // const [mfaEnable, setMfaEnable] = useState(true);

    const fade = useRef<HTMLDivElement>(null);
    const submit = useRef<HTMLDivElement>(null);
    const captcha = useRef<HCaptcha>(null);

    const navigate = useNavigate();

    const register = async () => {
        setError("");
        setLoading(true);
        if (stage === "details") {
            if (!email.trim()) {
                setLoading(false);
                setError("Email is blank");
                return;
            }
            // eslint-disable-next-line no-control-regex
            const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
            const match = email.trim().match(emailRegex);
            if (!match || match.length !== 1) {
                setLoading(false);
                setError("Invalid email");
                return;
            }
            setEmail(match[0]);
            const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/;
            if (!password.match(passwordRegex)) {
                setLoading(false);
                setError("Invalid password - must be at least 12 characters and contain at least one of each: lowercase letter, uppercase letter, number, and special character");
                return;
            }
            setLoading(false);
            if (fade.current) fade.current.style.animation = "1s fadeOutLeft";
            await new Promise(r => setTimeout(r, 1000));
            setStage("verify");
            if (fade.current) fade.current.style.animation = "1s fadeInRight";
        }
        if (stage === "verify") {
            const request = await createProtectedRequest("/api/user", "POST", JSON.stringify({
                display_name: displayName,
                username,
                email,
                password,
                captcha_token: captchaToken,
            }));
            if (request) {
                if (request.ok) {
                    const data = await request.json();
                    // setContinueToken(data.continue_token);
                    setToken(data.token);
                    setLoading(false);
                    if (fade.current) fade.current.style.animation = "1s fadeOutLeft";
                    await new Promise(r => setTimeout(r, 1000));
                    // setStage("verify");
                    setStage("done");
                    if (fade.current) fade.current.style.animation = "1s fadeInRight";

                    localStorage.setItem("token", token as string);
                    setTimeout(() => {
                        const getContinueUrl = new URLSearchParams(window.location.search).get("continue");
                        const url = new URL(getContinueUrl ? getContinueUrl : "https://nextflow.cloud");
                        if (getContinueUrl === "nextpass://auth") {
                            url.searchParams.set("token", localStorage.getItem("token") as string);
                        }
                        // url.searchParams.set("token", token);
                        window.location.href = url.toString();
                    }, 1000);
                } else if (request.status === 401) {
                    setLoading(false);
                    setError("Please complete the captcha before continuing.");
                } else if (request.status === 409) {
                    setLoading(false);
                    setError("This email is already registered.");
                } else {
                    setLoading(false);
                    setError("Unknown error occured, please check console for technical information.");
                }
            } else {
                setLoading(false);
                setError("Server timed out");
            }
        }
        // if (stage === "security") {
        //     const request = await createProtectedRequest("/api/user/onboarding", "POST", JSON.stringify({
        //         continue_token: continueToken,
        //         encrypt_ti: superSecureMode || tiEncryption,
        //         encrypt_ia: superSecureMode || iaEncryption,
        //         mfa: superSecureMode || mfaEnable,
        //     }));
        //     if (request) {
        //         if (request.ok) {
        //             const data = await request.json();
        //             setContinueToken(data.continue_token);
        //             setMfaSecret(`data:image/png;base64,${data.mfa_secret}`);
        //             const bin = new TextEncoder().encode(generateSecurityKeys(password));
        //             const keyBlob = URL.createObjectURL(new Blob([bin], { type: "application/octet-stream" }));
        //             setBackupFile(keyBlob);
        //             setLoading(false);
        //             if (fade.current) fade.current.style.animation = "1s fadeOutLeft";
        //             await new Promise(r => setTimeout(r, 1000));
        //             setStage("backup");
        //             if (fade.current) fade.current.style.animation = "1s fadeInRight";
        //         } else if (request.status === 403) {
        //             setLoading(false);
        //             setError("Try registering again, your session could have timed out.");
        //             if (fade.current) fade.current.style.animation = "1s fadeOutLeft";
        //             await new Promise(r => setTimeout(r, 1000));
        //             setStage("details");
        //             if (fade.current) fade.current.style.animation = "1s fadeInRight";
        //         } else {
        //             setLoading(false);
        //             setError("Unknown error occured, please check console for technical information.");
        //         }
        //     } else {
        //         setLoading(false);
        //         setError("Server timed out");
        //     }
        // }
        // if (stage === "backup") {
        //     const request = await createProtectedRequest("/api/user/security", "POST", JSON.stringify({
        //         continue_token: continueToken,
        //         code
        //     }));
        //     if (request) {
        //         if (request.ok) {
        //             const data = await request.json();
        //             setToken(data.token);
        //             setLoading(false);
        //             if (fade.current) fade.current.style.animation = "1s fadeOutLeft";
        //             await new Promise(r => setTimeout(r, 1000));
        //             setStage("done");
        //             if (fade.current) fade.current.style.animation = "1s fadeInRight";
        //         } else if (request.status === 401) {
        //             setLoading(false);
        //             setError("Code incorrect, please try again.");
        //         } else {
        //             setLoading(false);
        //             setError("Unknown error occured, please check console for technical information.");
        //         }
        //     } else {
        //         setLoading(false);
        //         setError("Server timed out");
        //     }
        // }
    };
    const press = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            register();
        }
    };
    const checkToken = async () => {
        if (token) {
            const r = await fetch("/api/validate", {
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
    const login = () => {
        const continueUrl = new URLSearchParams(window.location.search).get("continue");
        const href = continueUrl ? `/login?continue=${encodeURIComponent(continueUrl)}` : "/login";
        navigate(href);
    };
    const back = async () => {
        setLoading(false);
        if (fade.current) fade.current.style.animation = "1s fadeOutLeft";
        await new Promise(r => setTimeout(r, 1000));
        setStage("details");
        if (fade.current) fade.current.style.animation = "1s fadeInRight";
    };
    const initCaptcha = () => {
        captcha.current?.execute();
    };
    // const backup = () => {
    //     const a = document.createElement("a");
    //     a.href = backupFile;
    //     a.download = "nextflow-backup.bin";
    //     a.click();
    // };

    useEffect(() => {
        checkToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!checked) {
        return <div />;
    }
    if (stage === "details") {
        return (
            <FormBase loading={loading} setLang={setLang} lang={lang}>
                <div ref={fade} style={{
                    animation: "1s fadeInRight"
                }}>
                    <h1 class="text-3xl mb-5"><b>{i18n.translate(lang, "register")}</b></h1>
                    <div class="inside">
                        <label><b>{i18n.translate(lang, "credentials")}</b></label>
                        <div class="my-1">
                            <input
                                class="w-full p-2 border-gray-200 border rounded-md hover:border-green-400 mb-2 focus:border-green-400"
                                type="text"
                                placeholder={i18n.translate(lang, "enterDisplayName")}
                                disabled={loading}
                                onKeyDown={press}
                                value={displayName}
                                onChange={v => setDisplayName((v.target as HTMLInputElement).value)}
                            />
                            <input
                                class="w-full p-2 border-gray-200 border rounded-md hover:border-green-400 mb-2 focus:border-green-400"
                                type="text"
                                placeholder={i18n.translate(lang, "enterUsername")}
                                disabled={loading}
                                onKeyDown={press}
                                value={username}
                                onChange={v => setUsername((v.target as HTMLInputElement).value)}
                            />
                            <input
                                class="w-full p-2 border-gray-200 border rounded-md hover:border-green-400 mb-2 focus:border-green-400"
                                type="text"
                                placeholder={i18n.translate(lang, "enterEmail")}
                                disabled={loading}
                                onKeyDown={press}
                                value={email}
                                onChange={v => setEmail((v.target as HTMLInputElement).value)}
                            />
                            <input 
                                class="w-full p-2 border-gray-200 border rounded-md hover:border-green-400 mb-2" 
                                type="password" 
                                placeholder={i18n.translate(lang, "enterPassword")} 
                                disabled={loading} 
                                onKeyDown={press} 
                                value={password} 
                                onChange={v => setPassword((v.target as HTMLInputElement).value)} 
                            />
                        </div>
                        <Button onClick={register} divRef={submit} disabled={loading}>{i18n.translate(lang, "next")}</Button>
                    </div>
                    <div class="inside" />
                    <p class="inside">
                        {i18n.translate(lang, "haveAnAccount")} <a href="javascript:void(0)" onClick={login} class="text-blue-600">{i18n.translate(lang, "login")}</a>
                    </p>
                    <p class="inside error">
                        {error}
                    </p>
                </div>
            </FormBase>
        );
    }
    if (stage === "verify") {
        return (
            <FormBase loading={loading} setLang={setLang} lang={lang}>
                <div ref={fade} style={{
                    animation: "1s fadeInRight"
                }}>
                    <h1 class="text-3xl mb-5"><b>{i18n.translate(lang, "verification")}</b></h1>
                    <div class="inside">
                        <div class="bg-green-100 border-green-600 rounded-md border-2 my-2 px-2 py-2"><p>{i18n.translate(lang, "verificationDescription")}</p></div>
                        <div class="bg-blue-100 border-blue-600 rounded-md border-2 my-2 px-2 py-2">
                            {/* @ts-expect-error HCaptcha is a React component and it doesn't type well in Preact */}
                            <HCaptcha
                                sitekey={captchaKey}
                                onVerify={setCaptchaToken}
                                ref={captcha}
                                onLoad={initCaptcha}
                            />
                        </div>
                        <div class="space-y-3">
                            <Button onClick={back} divRef={submit} disabled={loading}>{i18n.translate(lang, "previous")}</Button>
                            <Button onClick={register} divRef={submit} disabled={loading}>{i18n.translate(lang, "next")}</Button>
                        </div>
                    </div>
                    <div class="inside" />
                    <p class="inside error">
                        {error}
                    </p>
                </div>
            </FormBase>
        );
    }
    // if (stage === "security") {
    //     return (
    //         <FormBase loading={loading} setLang={setLang} lang={lang}>
    //             <div ref={fade} style={{
    //                 animation: "1s fadeInRight"
    //             }}>
    //                 <h1 class="text-3xl mb-5"><b>{"Security"}</b></h1>
    //                 <div class="inside">
    //                     <label>
    //                         <input type="checkbox" checked={superSecureMode} onChange={e => setSuperSecureMode((e.target as HTMLInputElement).checked)} /> Enable Ultra Secure Mode
    //                     </label>
    //                     <br />
    //                     <label>
    //                         <input type="checkbox" disabled={superSecureMode} checked={superSecureMode || tiEncryption} onChange={e => setTiEncryption((e.target as HTMLInputElement).checked)} /> Enable Titaniumdrive encryption
    //                     </label>
    //                     <br />
    //                     <label>
    //                         <input type="checkbox" disabled={superSecureMode} checked={superSecureMode || iaEncryption} onChange={e => setIaEncryption((e.target as HTMLInputElement).checked)} /> Enable InterarchMail encryption
    //                     </label>
    //                     <br />
    //                     <label>
    //                         <input type="checkbox" disabled={superSecureMode} checked={superSecureMode || mfaEnable} onChange={e => setMfaEnable((e.target as HTMLInputElement).checked)} /> Enable two-factor authentication
    //                     </label>
    //                     <div class="bg-red-100 border-red-600 rounded-md border-2 my-2 px-2 py-2"><b>IMPORTANT!</b><p>We believe in your privacy, so Ultra Super Duper Secure Mode is enabled by default. However, if you don't want to keep another recovery key in case you forget your password, you can choose to turn it off. Your data will be encrypted; if you ever lose this recovery key, you will not be able to regain access to your data.</p>
    //                         <br /><p>This will also turn on two-factor authentication.</p>
    //                     </div>
    //                     <Button onClick={register} divRef={submit} disabled={loading}>{i18n.translate(lang, "next")}</Button>
    //                 </div>
    //                 <div class="inside" />
    //                 <p class="inside error">
    //                     {error}
    //                 </p>
    //             </div>
    //         </FormBase>
    //     );
    // }
    // if (stage === "backup") {
    //     return (
    //         <FormBase loading={loading} setLang={setLang} lang={lang}>
    //             <div ref={fade} style={{
    //                 animation: "1s fadeInRight"
    //             }}>
    //                 <h1 class="text-3xl mb-5"><b>{"Security"}</b></h1>
    //                 <div class="inside">
    //                     {/* <img src="/dummy-qr-code" alt="MFA QR code" /> */}
    //                     <img src={mfaSecret} alt="MFA QR code" />
    //                     <div class="bg-green-100 border-green-600 rounded-md border-2 my-2 px-2 py-2"><p>Please scan this QR code using your preferred authenticator app. We ask you to type in the code generated there just to make sure you've got it. ☺</p></div>
    //                     <input
    //                         class="w-full p-2 border-gray-200 border rounded-md hover:border-green-400 mb-2"
    //                         type="text" placeholder={i18n.translate(lang, "enterCode")}
    //                         disabled={loading}
    //                         onKeyDown={press}
    //                         value={code}
    //                         onChange={v => setCode((v.target as HTMLInputElement).value)}
    //                     />
    //                     <div class="bg-yellow-100 border-yellow-600 rounded-md border-2 my-2 px-2 py-2"><b>IMPORTANT!</b><p class="mb-1">Please download this recovery key and store it in a safe location. This will allow you to regain access to your encrypted data in case you lose your password.</p>
    //                         <Button onClick={backup}>Download recovery keys</Button>
    //                     </div>
    //                     <Button onClick={register} divRef={submit} disabled={loading}>{i18n.translate(lang, "next")}</Button>
    //                 </div>
    //                 <div class="inside" />
    //                 <p class="inside error">
    //                     {error}
    //                 </p>
    //             </div>
    //         </FormBase>
    //     );
    // }
    if (stage === "done") {
        return (
            <FormBase loading={loading} setLang={setLang} lang={lang}>
                <div ref={fade} style={{
                    animation: "1s fadeInRight"
                }}>
                    <h1 class="text-3xl mb-5"><b>{i18n.translate(lang, "continue")}</b></h1>
                    <div class="inside">
                        <label>{i18n.translate(lang, "loggedIn")}</label>
                    </div>
                    <p class="inside error">
                        {error}
                    </p>
                </div>
            </FormBase>
        );
    }
    if (stage === "skip") {
        return (
            <FormBase loading={loading} setLang={setLang} lang={lang}>
                <div ref={fade} style={{
                    animation: "1s fadeInRight"
                }}>
                    <h1 class="text-3xl mb-5"><b>{i18n.translate(lang, "continue")}</b></h1>
                    <div class="inside">
                        <label>{i18n.translate(lang, "alreadyLoggedIn")}</label>
                    </div>
                    <p class="inside error">
                        {error}
                    </p>
                </div>
            </FormBase>
        );
    }

    return <div />;
};

export default Register;
