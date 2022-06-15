import { render } from "preact";
import App from "./app";
import "./index.css";

import Internals from "./utilities/Internals";
const internals = new Internals();

Object.defineProperty(window, "internals", {
    value: internals,
    writable: false,
    configurable: false
});

// import { options, Component } from 'preact';

// options.debounceRendering = f => {
//     setTimeout(f, 1000);
// };

// ['setState', 'forceUpdate'].forEach(method => {
//     // @ts-expect-error
//     const old = Component.prototype[method];
//     // @ts-expect-error
//     Component.prototype[method] = function(state, cb) {
//         console.log(this, '.'+method+'(', state, ')');
//         old.call(this, state, cb);
//     };
// });

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(<App />, document.getElementById("app")!);
