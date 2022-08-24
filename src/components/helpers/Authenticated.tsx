import { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useNavigate } from "react-router";

// const getCookie = (name: string) => document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))?.[2];

const Authenticate = (props: { children: ComponentChildren; }) => {
    const [timedOut, setTimedOut] = useState(false);
    const [failed, setFailed] = useState(false);
    const [succeeded, setSucceeded] = useState(false);
    
    const navigate = useNavigate();

    const checkToken = async () => {
        const token = localStorage.getItem("token");
        if (token !== null) {
            const request = await Promise.race([fetch("/api/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token })
            }), new Promise(r => setTimeout(r, 5000))]);
            if (!(request instanceof Response)) setTimedOut(true);
            else if (!request.ok) setFailed(true);
            else setSucceeded(true);
        } else {
            setFailed(true);
        }
    };

    useEffect(() => {
        checkToken();
    }, []);

    if (failed) {
        navigate("/login");
        return <></>;
    }

    return (
        <>
            {timedOut && <div>Warning: SSO authentication server timed out. Check service status <a href="https://status.nextflow.cloud">here</a>.</div>}
            {succeeded && props.children}
        </>
    );
};

export default Authenticate;
