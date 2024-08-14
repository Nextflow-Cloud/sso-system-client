import { Navigate, Route, Router } from "@solidjs/router";
import FormBase from "./components/FormBase";
import { createSignal } from "solid-js";
import { Language } from "./utilities/i18n";
import Login from "./routes/Login";
import ManageAccount from "./routes/ManageAccount";
import Register from "./routes/Register";
import Authenticated from "./components/Authenticated";
import { StateProvider } from "./context";
import Logout from "./routes/Logout";

const App = () => {
  const [loading, setLoading] = createSignal(false);
  const [lang, setLang] = createSignal(localStorage.getItem("lang") as Language || "fr");

  return (
      <StateProvider>
        <Router>
          {/* <Route /> */}
          <Route path="/" component={() => (
            <Authenticated>
              <Navigate href="/manage" />
            </Authenticated>
          )} />
          <Route path="/login" component={() => (
            <FormBase loading={loading} lang={lang} setLang={setLang}>
              <Login loading={loading} setLoading={setLoading} lang={lang} />
            </FormBase>
          )} />
          <Route path="/register" component={() => (
            <FormBase loading={loading} lang={lang} setLang={setLang}>
              <Register loading={loading} setLoading={setLoading} lang={lang} />
            </FormBase>
          )} />
          <Route path="/manage/:category?" matchFilters={{ category: ["account", "profile", "sessions"] }} component={() => (
            <Authenticated>
              <ManageAccount />
            </Authenticated>
          )} />
          <Route path="/logout" component={() => (
            <FormBase loading={loading} lang={lang} setLang={setLang}>
              <Logout />
            </FormBase>
          )} />
        </Router>
      </StateProvider>
  );
};

export default App;
