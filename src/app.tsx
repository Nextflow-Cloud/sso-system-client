import { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FormBase from "./components/FormBase";
import Authenticate from "./routes/Authenticate";
import Forgot from "./routes/Forgot";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import Register from "./routes/Register";
import Root from "./routes/Root";
import Wave from "./wave";

const App = () => {
    const [modalDialog, setModalDialog] = useState<JSX.Element>();
    useEffect(() => {
        window.internals.initializeModalDialog(modalDialog, setModalDialog);
    }, [modalDialog]);

    const [loading, setLoading] = useState(false);
    const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");

    return (
        <>
            <BrowserRouter>
                <FormBase loading={loading} lang={lang} setLang={setLang}>
                    <Routes>
                        <Route path="/" element={<Root />} />
                        <Route path="/authenticate" element={<Authenticate />} />
                        <Route path="/login" element={<Login loading={loading} setLoading={setLoading} lang={lang} />} />
                        <Route path="/register" element={<Register loading={loading} setLoading={setLoading} lang={lang} />} />
                        <Route path="/forgot" element={<Forgot />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </FormBase>
            </BrowserRouter>
            {modalDialog ? modalDialog : <></>}
            <Wave />
        </>
    );
};

export default App;
