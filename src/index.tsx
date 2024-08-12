/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

import Internals from "./utilities/Internals";
const internals = new Internals();

Object.defineProperty(window, "internals", {
    value: internals,
    writable: false,
    configurable: false
});

const root = document.getElementById("root");

render(() => <App />, root!);
