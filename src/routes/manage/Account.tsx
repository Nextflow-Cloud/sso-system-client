import { styled } from "solid-styled-components";
import Button from "../../components/primitive/Button";
import Input from "../../components/primitive/Input";
import { Section } from "../ManageAccount";
import Switch, { SwitchContainer } from "../../components/primitive/Switch";
import Box from "../../components/primitive/Box";
import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import { useGlobalState } from "../../context";
import UpdateAuthenticator, { AuthenticateType } from "../../components/UpdateAuthenticator";

const Account = () => {
    const [username, setUsername] = createSignal<string>("");
    const [newPassword, setNewPassword] = createSignal<string>("");
    const [twoFactor, setTwoFactor] = createSignal<boolean>(false);
    const [dialogType, setDialogType] = createSignal<AuthenticateType>();
    const state = createMemo(() => useGlobalState());
    createEffect(() => {
        let settings = state()?.settings;
        if (!settings) return;
        if (twoFactor() !== settings.mfaEnabled) {
            // open password dialog
            setDialogType(twoFactor() ? "ENABLE_MFA" : "DISABLE_MFA");
        }
    });

    onMount(async () => {
        let settings = state().settings;
        if (!settings) {
            const session = state().session;
            if (!session) return console.error("No session found");
            settings = await session.getSettings();
        }
        setTwoFactor(settings.mfaEnabled);
        setUsername(settings.username);
    });

    const updateAccount = () => {
        // TODO: check for invalid passwords
        let newUsername: string|undefined = username();
        if (newUsername === state().settings?.username || !newUsername) newUsername = undefined;
        let newPasswordUnwrap: string|undefined = newPassword();
        if (!newPasswordUnwrap) newPasswordUnwrap = undefined;
        if (!newUsername && !newPassword) return;
        state().setStagedAccountSettings({
            username: newUsername,
            newPassword: newPasswordUnwrap,
        });
        setDialogType("UPDATE_ACCOUNT");
        // TODO: open dialog
    };

    const deleteAccount = () => {

    }
    return (
        <>
        
            <h1>Manage account</h1>
            <Section>
                <Input placeholder="Username" loading={false} value={username()} onChange={e => setUsername((e.target as HTMLInputElement).value)} />
                <Input placeholder="New password" loading={false} value={newPassword()} onChange={e => setNewPassword((e.target as HTMLInputElement).value)} />
                <Button onClick={updateAccount}>Commit</Button>
            </Section>
            <Section>
                <Box type="warning">
                    Two factor authentication is highly recommended to secure your account.
                </Box>
                <SwitchContainer>
                    <Switch onChange={e => setTwoFactor((e.target as HTMLInputElement).checked)} checked={twoFactor()} />
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
            <UpdateAuthenticator type={dialogType()} />
        </>
    )
};

export default Account;