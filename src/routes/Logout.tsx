import { useEffect, useState } from "preact/hooks";
import Fade from "../components/Fade";
import Title from "../components/primitive/Title";
import createProtectedRequest from "../utilities/createProtectedRequest";
// import i18n from "../utilities/i18n";

const Logout = () => {
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            await createProtectedRequest("/api/login", "DELETE", JSON.stringify({}), {
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
        <Fade hiding={false}>
            <Title>Logout</Title>
            <div>
                <label>{loading ? "Please wait while you are being logged out." : "You have been logged out. Have a great day!"}</label>
            </div>
        </Fade>
    );
};

export default Logout;
