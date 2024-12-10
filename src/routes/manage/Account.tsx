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
import { useTranslate } from "../../utilities/i18n";

type DialogType = "DELETE" | "MFA" | "NONE";

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
    const t = useTranslate();

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

    createEffect(async () => {
        let settings = state().get("settings");
        if (settings) {
            let mfa = twoFactor();
            console.log(mfa, settings.mfaEnabled);
            if (mfa !== undefined && mfa !== settings.mfaEnabled) {
                if (settings.mfaEnabled === false && mfa === true) {
                    // open setup dialog
                    setDialogType("MFA");
                    dialogContext().setOpen(true);
                } else {
                    const client = state().get("session");
                    if (client && client.isElevated()) {
                        try {
                            await client.configureMfa();
                            state().update("settings", { mfaEnabled: false });
                        } catch(e) {
                            state().update("settings", { mfaEnabled: true });   
                        }
                    }
                }
            }
        }
    });

    
    createEffect(() => {
        if (!dialogContext().open()) {
            let settings = state().get("settings");
            if (settings) {
                setTwoFactor(settings.mfaEnabled);
            }
            setDialogType("NONE");
        }
    });

    const updateAccount = async () => {
        let newUsername: string|undefined = username()?.trim();
        if (newUsername === state().get("settings")?.username || !newUsername) newUsername = undefined;
        if (newUsername && !(/^[0-9A-Za-z_.-]{3,32}$/).test(newUsername)) {
            // TODO: show error
            return alert("Invalid username");
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
                await client.createPasskey();
            } catch {
                window.location.reload();
            }
        }
    };

    const updatePassword = async () => {
        let newPasswordUnwrap: string | undefined = newPassword();
        if (!newPasswordUnwrap) newPasswordUnwrap = undefined;
        if (calculateEntropy(newPasswordUnwrap) < 64) {
            // TODO: show error
            return alert("Password is too weak");
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
        
            <h1>{t("MANAGE_ACCOUNT")}</h1>
                <Show when={!escalated()}>
            <Section>
                    <Box type="error">
                        <h2>{t("ESCALATION_REQUIRED")}</h2>
                        <p>
                            {t("ESCALATION_REQUIRED_DESCRIPTION")}
                        </p>
                        <Button onClick={() => {
                            navigate("/escalate");
                        }}>{t("CONTINUE")}</Button>
                    </Box>
            </Section>
            </Show>

            <Section>
                <Input placeholder={t("USERNAME")} loading={loading() || dialogContext().open() || !escalated()} value={username()} onChange={e => setUsername((e.target as HTMLInputElement).value)} />
                <Button onClick={updateAccount}  disabled={loading() || dialogContext().open() || !escalated()}>{t("UPDATE_ACCOUNT")}</Button>
                    
            </Section>
            <Section>
                <Input placeholder={t("NEW_PASSWORD")} loading={loading() || dialogContext().open() || !escalated()} type="password" value={newPassword()} onChange={e => setNewPassword((e.target as HTMLInputElement).value)} />
                <Button onClick={updatePassword}  disabled={loading() || dialogContext().open() || !escalated()}>{t("UPDATE_PASSWORD")}</Button>
            </Section>
            <Section>
                <Box type="warning">
                    {t("MFA_DESCRIPTION")}
                </Box>
                <SwitchContainer>
                    <Switch checked={twoFactor} setChecked={setTwoFactor} disabled={loading() || dialogContext().open() || !escalated()} />
                    <span>{t("MFA")}</span>
                </SwitchContainer>
            </Section>
            <Section>
                <Box type="information">
                    <h2>{t("PASSKEYS")}</h2>
                    <p>
                        {t("PASSKEYS_DESCRIPTION")}
                    </p>
                </Box>
                <Box type="error">
                    <p>
                        {t("PASSKEYS_WARNING")}
                    </p>
                </Box>
                <Button onClick={addPasskey} disabled={loading() || dialogContext().open() || !escalated()}>{t("PASSKEYS_ADD")}</Button>
                <PasskeyList>
                    <thead>
                        <tr>
                            <th>{t("ID")}</th>
                            <th>{t("FRIENDLY_NAME")}</th>
                            <th>{t("ACTIONS")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {passkeys().map(p => (
                            <tr>
                                <td>{p.id}</td>
                                <td>{p.friendlyName}</td>
                                <td>
                                    <Button onClick={() => deletePasskey(p.id)} disabled={loading() || dialogContext().open() || !escalated()}>{t("PASSKEYS_DELETE")}</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </PasskeyList>
            </Section>
            <Section>
                <Box type="error">
                    <h2>{t("DANGER_ZONE")}</h2>
                    <p>
                        {t("DELETE_ACCOUNT_DESCRIPTION")}
                    </p>
                </Box>
                <Button onClick={deleteAccount} disabled={loading() || dialogContext().open() || !escalated()}>{t("DELETE_ACCOUNT")}</Button>
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