/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
// TODO: WIP
import { useRef, useState } from "preact/hooks";
import ErrorText from "../components/ErrorText";
import Fade from "../components/Fade";
import Box from "../components/primitive/Box";
import Button from "../components/primitive/Button";
import Title from "../components/primitive/Title";
import i18n from "../utilities/i18n";

const Forgot = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");
    const [stage, setStage] = useState("initial");
    
    const [hiding, setHiding] = useState(false);
    const submit = useRef<HTMLDivElement>(null);

    const next = () => {
        //
    };

    if (stage === "initial") {
        return (
            <Fade hiding={hiding}>
                <Title>Reset password</Title>
                <div>  
                    <div class="my-1">
                        This page will walk you through the process of resetting your password.
                    </div>
                    <Box type="information">
                        <b>WARNING!</b>
                        <p>Before you continue, we must remind you that resetting your password will result in irreversable changes! If encryption is enabled for any services, encrypted data in those services will be lost as a result of this operation unless you have a recovery key. Only you know the encryption key to your data, and not us. This grants you maximum privacy, however, we cannot assist in recovering your data.</p><br /><p>Only click Next if you are sure of what you are doing.</p>
                    </Box>
                    <Button onClick={next} disabled={loading}>{i18n.translate(lang, "next")}</Button>
                </div>
                <div class="inside" />
                <ErrorText>
                    {error}
                </ErrorText>
            </Fade>
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
