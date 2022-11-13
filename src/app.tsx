import { JSX } from "preact";
import { lazy, Suspense } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormBase from "./components/FormBase";
import Wave from "./wave";

const Root = lazy(() => import("./routes/Root"));
const Authenticate = lazy(() => import("./routes/Authenticate"));
const Login = lazy(() => import("./routes/Login"));
const Register = lazy(() => import("./routes/Register"));
const Forgot = lazy(() => import("./routes/Forgot"));
const Logout = lazy(() => import("./routes/Logout"));

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
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<Root />} />
                            <Route path="/authenticate" element={<Authenticate />} />
                            <Route path="/login" element={<Login loading={loading} setLoading={setLoading} lang={lang} />} />
                            <Route path="/register" element={<Register loading={loading} setLoading={setLoading} lang={lang} />} />
                            <Route path="/forgot" element={<Forgot />} />
                            <Route path="/logout" element={<Logout />} />
                        </Routes>
                    </Suspense>
                </FormBase>
            </BrowserRouter>
            {modalDialog ? modalDialog : <></>}
            <Wave />
        </>
    );
};

export default App;
