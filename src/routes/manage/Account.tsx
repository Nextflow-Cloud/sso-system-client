import Button from "../../components/primitive/Button";
import Input from "../../components/primitive/Input";
import { Section } from "../ManageAccount";
import Switch, { SwitchContainer } from "../../components/primitive/Switch";
import Box from "../../components/primitive/Box";
import { Accessor, createEffect, createMemo, createSignal, onMount, Setter } from "solid-js";
import { useGlobalState } from "../../context";
import UpdateAuthenticator, { AuthenticateType } from "../../components/UpdateAuthenticator";
import Dialog from "@corvu/dialog";
import { calculateEntropy } from "../../utilities/client";

const Account = ({ loading, setLoading }: { loading: Accessor<boolean>; setLoading: Setter<boolean>; }) => {
    const [username, setUsername] = createSignal<string>();
    const [newPassword, setNewPassword] = createSignal<string>("");
    const [twoFactor, setTwoFactor] = createSignal<boolean>();
    const [dialogType, setDialogType] = createSignal<AuthenticateType>();
    const state = createMemo(() => useGlobalState());
    const dialogContext = createMemo(() => Dialog.useContext());

    onMount(async () => {
        setLoading(true);
        let settings = state().get("settings");
        if (!settings) {
            const session = state().get("session");
            if (!session) return console.error("No session found");
            settings = await session.getSettings();
            state().set("settings", settings);
        }
        setTwoFactor(settings.mfaEnabled);
        setUsername(settings.username);
        setLoading(false);
    });

    createEffect(() => {
        let settings = state().get("settings");
        if (settings) {
            let mfa = twoFactor();
            if (mfa !== undefined && mfa !== settings.mfaEnabled) {
                // open password dialog
                setDialogType(twoFactor() ? "ENABLE_MFA" : "DISABLE_MFA");
                dialogContext().setOpen(true);
            }
        }
    });

    
    createEffect(() => {
        if (!dialogContext().open()) {
            let settings = state().get("settings");
            if (settings) {
                setTwoFactor(settings.mfaEnabled);
            }
        }
    });

    const updateAccount = () => {
        let newUsername: string|undefined = username()?.trim();
        if (newUsername === state().get("settings")?.username || !newUsername) newUsername = undefined;
        if (newUsername && !(/^[0-9A-Za-z_.-]{3,32}$/).test(newUsername)) {
            // TODO: show error
            return;
        }
        let newPasswordUnwrap: string|undefined = newPassword();
        if (!newPasswordUnwrap) newPasswordUnwrap = undefined;
        if (calculateEntropy(newPasswordUnwrap) < 64) {
            // TODO: show error
            return;
        }
        if (!newUsername && !newPasswordUnwrap) return; // nothing to do
        state().set("stagedAccountSettings", {
            username: newUsername,
            newPassword: newPasswordUnwrap,
        });
        setDialogType("UPDATE_ACCOUNT");
        dialogContext().setOpen(true);
    };

    const deleteAccount = () => {
        setDialogType("DELETE_ACCOUNT");
        dialogContext().setOpen(true);
    };
    return (
        <>
        
            <h1>Manage account</h1>
            <Section>
                <Input placeholder="Username" loading={loading() || dialogContext().open()} value={username()} onChange={e => setUsername((e.target as HTMLInputElement).value)} />
                <Input placeholder="New password" loading={loading() || dialogContext().open()} password value={newPassword()} onChange={e => setNewPassword((e.target as HTMLInputElement).value)} />
                <Button onClick={updateAccount} disabled={loading()}>Commit</Button>
            </Section>
            <Section>
                <Box type="warning">
                    Two factor authentication is highly recommended to secure your account.
                </Box>
                <SwitchContainer>
                    <Switch checked={twoFactor} setChecked={setTwoFactor} />
                    <span>Two factor authentication</span>
                </SwitchContainer>
                <Box type="error">
                    <h2>Danger zone</h2>
                    <p>
                        Nextflow is committed to your privacy and security. Your data will be removed from our servers as soon as possible.
                    </p>
                </Box>
                <Button onClick={deleteAccount}>Delete account</Button>
            </Section>
            <UpdateAuthenticator type={dialogType()} loading={loading} setLoading={setLoading} />
        </>
    )
};

export default Account;