import { Logo } from "./logo";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Logo />} />
                </Routes>
            </BrowserRouter>
        </>
    );
    // return (
    //     <>
    //         <Logo />
    //         <p>Hello Vite + Preact!</p>
    //         <p>
    //             <a
    //                 class="link"
    //                 href="https://preactjs.com/"
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //             >
    //       Learn Preact
    //             </a>
    //         </p>
    //     </>
    // );
};

export default App;
