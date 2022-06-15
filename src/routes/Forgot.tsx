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
    const next = () => {

    };
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
                    <div className="bg-yellow-100 border-yellow-600 border-2 rounded-md my-5 px-2 py-2"><b>WARNING!</b><p>Before you continue, here's a quick reminder that resetting your password will result in irreversable changes! This operation will wipe some of your data, including encrypted files in Titaniumdrive. This is due to the files being encrypted for maximum security using a key derived from your password.</p><br /><p>Only click Next if you know what you are doing.</p></div>
                    <Button onClick={next} divRef={submit}>{i18n.translate(lang, "next")}</Button>
                </div>
                <div className="inside" />
                <p className='inside error'>
                    {error}
                </p>
            </div>
        </FormBase>
    );
};

// Please note that your data will be wiped as it is encrypted with a key derived from your old password.
export default Forgot;
