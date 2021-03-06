import { JSX } from "preact";
import { StateUpdater } from "preact/hooks";
import ModalDialog, { Button } from "../components/ModalDialog";
import createProtectedRequest, { Method } from "./createProtectedRequest";

class Internals {
    protected flags: Record<string, boolean> = {};
    protected modalDialog?: JSX.Element | null;
    // eslint-disable-next-line no-unused-vars
    protected setModalDialog?: StateUpdater<JSX.Element | undefined>;

    // eslint-disable-next-line no-unused-vars
    initializeModalDialog(modalDialog: JSX.Element | null | undefined, setModalDialog: StateUpdater<JSX.Element | undefined>) {
        this.modalDialog = modalDialog;
        this.setModalDialog = setModalDialog;
    }

    applyFlag(k: string, v: boolean) {
        this.flags[k] = v;
    }

    fetchFlag(k: string) {
        return this.flags[k];
    }

    // eslint-disable-next-line no-unused-vars
    showModalDialog(title: string, content: string, buttons: Button[], onClose: (id: string, checkbox?: boolean) => void, checkbox?: string) {
        this.setModalDialog?.(ModalDialog({ title, content, buttons, onClose, checkbox }));
    }

    hideModalDialog() {
        this.setModalDialog?.(undefined);
    }

    // eslint-disable-next-line no-undef
    async createProtectedRequest(url: string, method: Method, json: string): Promise<Response | undefined> {
        return await createProtectedRequest(url, method, json);
    }
}

export default Internals;
