import { Route, Router } from "@solidjs/router";
import FormBase from "./components/FormBase";
import { createSignal } from "solid-js";
import { Language } from "./utilities/i18n";
import Login from "./routes/Login";

const App = () => {
  const [loading, setLoading] = createSignal(false);
  const [lang, setLang] = createSignal(localStorage.getItem("lang") as Language || "fr");

  return (
      <Router>
        {/* <Route /> */}
        <Route path="/login" component={() => (
          <FormBase loading={loading} lang={lang} setLang={setLang}>
            <Login loading={loading} setLoading={setLoading} lang={lang} />
          </FormBase>
        )} />
      </Router>
  );
};

export default App;
