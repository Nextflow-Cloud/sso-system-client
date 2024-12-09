import Button from "../../components/primitive/Button";
import Input from "../../components/primitive/Input";
import { Section } from "../ManageAccount";
import Switch, { SwitchContainer } from "../../components/primitive/Switch";
import Box from "../../components/primitive/Box";
import { Accessor, createEffect, createMemo, createSignal, onMount, Setter, Show } from "solid-js";
import { useGlobalState } from "../../context";
import Mfa from "../../components/dialogs/Mfa";
import Dialog from "@corvu/dialog";
import { calculateEntropy } from "../../utilities/client";
import { useNavigate } from "@solidjs/router";
import Delete from "../../components/dialogs/Delete";
import { styled } from "solid-styled-components";
import { Passkey } from "../../utilities/lib/manage";

type DialogType = "DELETE" | "MFA";

const PasskeyList = styled.table`
    margin-top: 20px;
    border-radius: 10px;
    border: 1px solid var(--secondary-a);
    background-color: var(--secondary-a);
    padding: 10px;
    
    & > thead > tr > th  {
        border-bottom: 1px solid var(--secondary-light);
    }
`;

const Account = ({ loading, setLoading }: { loading: Accessor<boolean>; setLoading: Setter<boolean>; }) => {
    const [username, setUsername] = createSignal<string>();
    const [newPassword, setNewPassword] = createSignal<string>("");
    const [twoFactor, setTwoFactor] = createSignal<boolean>();
    const state = createMemo(() => useGlobalState());
    const dialogContext = createMemo(() => Dialog.useContext());
    const [dialogType, setDialogType] = createSignal<DialogType>();
    const escalated = createMemo(() => state().get("session")?.isElevated());
    const navigate = useNavigate();
    const [passkeys, setPasskeys] = createSignal<Passkey[]>([]);

    onMount(async () => {
        setLoading(true);
        let settings = state().get("settings");
        const session = state().get("session");
        if (!session) return console.error("No session found");
        if (!settings) {
            settings = await session.getSettings();
            state().set("settings", settings);
        }
        const passkeys = await session.getPasskeys();
        setPasskeys(passkeys);
        setTwoFactor(settings.mfaEnabled);
        setUsername(settings.username);
        setLoading(false);
    });

    createEffect(() => {
        let settings = state().get("settings");
        if (settings) {
            let mfa = twoFactor();
            if (mfa !== undefined && settings.mfaEnabled === false && mfa === true) {
                // open setup dialog
                setDialogType("MFA");
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

    const updateAccount = async () => {
        let newUsername: string|undefined = username()?.trim();
        if (newUsername === state().get("settings")?.username || !newUsername) newUsername = undefined;
        if (newUsername && !(/^[0-9A-Za-z_.-]{3,32}$/).test(newUsername)) {
            // TODO: show error
            return;
        }
        if (!newUsername) return; // no changes
        setLoading(true);
        const client = state().get("session");
        if (client && client.isElevated()) {
            try {
                await client.commitAccountSettings({ username: newUsername });
            } catch {
                window.location.reload();
            }
        }
        setLoading(false);
    };

    const addPasskey = async () => {
        const client = state().get("session");
        if (client && client.isElevated()) {
            try {
                await client.createPasskey().catch( e=> {
                    console.log(e)
                    if ((e as any).toString() === "UNKNOWN_ERROR") {
                        localStorage.removeItem("escalationToken");
                        window.location.reload();
                    } 
                });
            } catch(e) {
                console.log(e)
                if ((e as any).toString() === "UNKNOWN_ERROR") {
                    localStorage.removeItem("escalationToken");
                    window.location.reload();
                } 
            }
        }
    };

    const updatePassword = async () => {
        let newPasswordUnwrap: string | undefined = newPassword();
        if (!newPasswordUnwrap) newPasswordUnwrap = undefined;
        if (calculateEntropy(newPasswordUnwrap) < 64) {
            // TODO: show error
            return;
        }
        if (!newPasswordUnwrap) return; // no changes
        setLoading(true);
        const client = state().get("session");
        if (client && client.isElevated()) {
            try {
                await client.updatePassword(newPasswordUnwrap);
            } catch {
                window.location.reload();
            }
        }
        setLoading(false);
    }

    const deleteAccount = () => {
        setDialogType("DELETE");
        dialogContext().setOpen(true);
    };
    const deletePasskey = async (id: string) => {
        setLoading(true);
        const client = state().get("session");
        if (client && client.isElevated()) {
            try {
                await client.deletePasskey(id);
                const passkeys = await client.getPasskeys();
                setPasskeys(passkeys);
            } catch {
                window.location.reload();
            }
        }
        setLoading(false);
    };

    return (
        <>
        
            <h1>Manage account</h1>
                <Show when={!escalated()}>
            <Section>
                    <Box type="error">
                        <h2>Escalation required</h2>
                        <p>
                            To manage your account, you must provide your password.
                        </p>
                        <Button onClick={() => {
                            navigate("/escalate");
                        }}>Continue</Button>
                    </Box>
            </Section>
            </Show>

            <Section>
                <Input placeholder="Username" loading={loading() || dialogContext().open() || !escalated()} value={username()} onChange={e => setUsername((e.target as HTMLInputElement).value)} />
                <Button onClick={updateAccount}  disabled={loading() || dialogContext().open() || !escalated()}>Update</Button>
                    
            </Section>
            <Section>
                <Input placeholder="New password" loading={loading() || dialogContext().open() || !escalated()} password value={newPassword()} onChange={e => setNewPassword((e.target as HTMLInputElement).value)} />
                <Button onClick={updatePassword}  disabled={loading() || dialogContext().open() || !escalated()}>Update password</Button>
            </Section>
            <Section>
                <Box type="warning">
                    Two-factor authentication is highly recommended to secure your account.
                </Box>
                <SwitchContainer>
                    <Switch checked={twoFactor} setChecked={setTwoFactor} disabled={loading() || dialogContext().open() || !escalated()} />
                    <span>Two-factor authentication</span>
                </SwitchContainer>
            </Section>
            <Section>
                <Box type="information">
                    <h2>Passkeys</h2>
                    <p>
                        You can use passkeys to securely log in to your account without a password. These can include biometric data, physical security keys, and other methods.
                    </p>
                </Box>
                <Box type="error">
                    <p>
                        Heads up! Our passkey system uses discoverable credentials. Please be mindful that some security keys may not be able to delete them.
                    </p>
                </Box>
                <Button onClick={addPasskey} disabled={loading() || dialogContext().open() || !escalated()}>Add passkey</Button>
                <PasskeyList>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Friendly name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {passkeys().map(p => (
                            <tr>
                                <td>{p.id}</td>
                                <td>{p.friendlyName}</td>
                                <td>
                                    <Button onClick={() => deletePasskey(p.id)} disabled={loading() || dialogContext().open() || !escalated()}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </PasskeyList>
            </Section>
            <Section>
                <Box type="error">
                    <h2>Danger zone</h2>
                    <p>
                        Nextflow is committed to your privacy and security. Your data will be removed from our servers as soon as possible.
                    </p>
                </Box>
                <Button onClick={deleteAccount} disabled={loading() || dialogContext().open() || !escalated()}>Delete account</Button>
            </Section>
            <Show when={dialogType() === "DELETE"}>
                <Delete loading={loading} setLoading={setLoading} />
            </Show>
            <Show when={dialogType() === "MFA"}>
                <Mfa loading={loading} setLoading={setLoading} />
            </Show>
        </>
    )
};

export default Account;