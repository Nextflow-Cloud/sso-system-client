import { JSX } from "preact";
import { lazy, Suspense } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authenticate from "./routes/Authenticate";
import Forgot from "./routes/Forgot";

const Login = lazy(() => import("./routes/Login"));
const Root = lazy(() => import("./routes/Root"));

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
