import { JSX } from "preact";
import { lazy, Suspense } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Root = lazy(() => import("./routes/Root"));
const Authenticate = lazy(() => import("./routes/Authenticate"));
const Login = lazy(() => import("./routes/Login"));
const Forgot = lazy(() => import("./routes/Forgot"));

const App = () => {
    const [modalDialog, setModalDialog] = useState<JSX.Element>();
    useEffect(() => {
        window.internals.initializeModalDialog(modalDialog, setModalDialog);
    }, [modalDialog]);
    return (
        <>
            <BrowserRouter>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<Root />} />
                        <Route path="/authenticate" element={<Authenticate />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot" element={<Forgot />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
            {modalDialog ? modalDialog : <></>}
        </>
    ); 
};

export default App;
