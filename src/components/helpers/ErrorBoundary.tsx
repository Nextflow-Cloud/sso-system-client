import { ComponentChildren } from "preact";
import { useErrorBoundary } from "preact/hooks";
import ModalDialog from "../ModalDialog";

const ErrorBoundary = (props: { children: ComponentChildren; }) => {
    const [error, ignoreError] = useErrorBoundary();

    const onClose = async (id: string, checkbox?: boolean) => {
        if (checkbox) {
            const request = await Promise.race([fetch("/api/error-reporting", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    error,
                    timestamp: Date.now()
                })
            }), new Promise(r => setTimeout(r, 5000))]);
            if (request instanceof Response && request.ok) {
                const response = await request.json();
                console.log(`Error reporting successful (ID: ${response.id})`);
            } else {
                // Error reporting failed, no biggie
                console.log("Error reporting failed");
            }
            window.internals;
        }
        if (id === "yes") {

        } else {
            ignoreError();
        }
    };

    if (error) {
        return (
            <>
                <ModalDialog title="Error" content={`Uh oh! We've encountered an unexpected error and the page needs to be reloaded. Sorry for the inconvenience!\n\nTechnical details:\nTimestamp: ${Date.now()}\nError stack trace: ${error}\n\nIf this error persists, please go to our GitHub issues page [here]() and report it. Alternatively, you can allow us to automatically file a bug report for you by generating a debug ID.`} buttons={[{ id: "yes", text: "Reload page", primary: true }, { id: "no", text: "Ignore error and attempt to continue" }]} onClose={onClose} checkbox="Automatically submit error report" />
            </>
        );
    }
    return (
        <>
            {props.children}
        </>
    );
};

export default ErrorBoundary;
