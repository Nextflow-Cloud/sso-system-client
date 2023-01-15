import { render } from "preact";
import App from "./app";
import "./index.css";

// TODO: Possibly convert to Solid app

import Internals from "./utilities/Internals";
const internals = new Internals();

Object.defineProperty(window, "internals", {
    value: internals,
    writable: false,
    configurable: false
});

render(<App />, document.getElementById("app") as HTMLElement);
