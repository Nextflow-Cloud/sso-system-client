/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
// TODO: WIP
import { useRef, useState } from "preact/hooks";
import FormBase from "../components/FormBase";
import Button from "../components/primitive/Button";
import i18n from "../utilities/i18n";

const Forgot = () => {
    const fade = useRef<HTMLDivElement>(null);
    const submit = useRef<HTMLDivElement>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");
    const [stage, setStage] = useState("initial");
    const next = () => {
        //
    };
    if (stage === "initial") {
        return (
            <FormBase loading={loading} setLang={setLang} lang={lang}>
                <div ref={fade} style={{
                    animation: "1s fadeInRight"
                }}>
                    <h1 className="text-3xl mb-5"><b>Reset password</b></h1>
                    <div className="inside">  
                        
                        <div className='my-1'>
                            This will walk you through the process of resetting your password.
                        </div>
                        <div className="bg-yellow-100 border-yellow-600 border-2 rounded-md my-2 px-2 py-2"><b>WARNING!</b><p>Before you continue, we must remind you that resetting your password will result in irreversable changes! Your encrypted data will be lost as a result of this operation if you have enabled encryption for some services, unless you have a recovery key. Only you (the user) knows the encryption key to your data, not the server, so we cannot assist in recovering the data.</p><br /><p>Only click Next if you know what you are doing.</p></div>
                        <Button onClick={next} divRef={submit} disabled={loading}>{i18n.translate(lang, "next")}</Button>
                    </div>
                    <div className="inside" />
                    <p className='inside error'>
                        {error}
                    </p>
                </div>
            </FormBase>
        );
    }
    if (stage === "verify") {

    }
    if (stage === "code") {

    }
    if (stage === "key") {

    }
    return <div />;

};

export default Forgot;
