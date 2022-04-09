import { render } from "preact";
import App from "./app";
import "./index.css";

import Internals from "./utilities/Internals";
const internals = new Internals();

interface ClientWindow extends Window {
    internals: Internals;
}

declare const window: ClientWindow;

Object.defineProperty(window, "internals", {
    value: internals,
    writable: false,
    configurable: false
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(<App />, document.getElementById("app")!);
