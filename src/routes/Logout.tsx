import { useEffect, useState } from "preact/hooks";
import FormBase from "../components/FormBase";
import createProtectedRequest from "../utilities/createProtectedRequest";
// import i18n from "../utilities/i18n";

const Logout = () => {
    const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            await createProtectedRequest("https://sso.nextflow.cloud/api/logout", "DELETE", JSON.stringify({}), {
                Authorization: `Bearer ${token}`
            });
            localStorage.removeItem("token");
        }
        setLoading(false);
    };

    useEffect(() => {
        // TODO: use POST /api/session to login and DELETE /api/session to logout
        logout();
    }, []);

    return (
        <FormBase loading={false} setLang={setLang} lang={lang}>
            <div style={{
                animation: "1s fadeInRight"
            }}>
                <h1 className="text-3xl mb-5"><b>Logout</b></h1>
                <div className="inside">
                    <label>{loading ? "Please wait while you are being logged out." : "You have been logged out. Have a great day!"}</label>
                </div>
            </div>
        </FormBase>
    );
};

export default Logout;
