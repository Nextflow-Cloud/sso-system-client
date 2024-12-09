
import { Section } from "../ManageAccount";
import Box from "../../components/primitive/Box";
import Switch, { SwitchContainer } from "../../components/primitive/Switch";
import Button from "../../components/primitive/Button";
import { decodeTime } from "ulid";
import { createMemo, createSignal, onMount } from "solid-js";
import { useGlobalState } from "../../context";
import { styled } from "solid-styled-components";
import { Session } from "../../utilities/lib/manage";
import { useTranslate } from "../../utilities/i18n";

const SessionList = styled.table`
    margin-top: 20px;
    border-radius: 10px;
    border: 1px solid var(--secondary-a);
    background-color: var(--secondary-a);
    padding: 10px;
    
    & > thead > tr > th  {
        border-bottom: 1px solid var(--secondary-light);
    }
`;

const SessionItems = styled.tbody`
    & > tr {
    }
`

const Sessions = () => {
    const [ipLogging, setIpLogging] = createSignal<boolean>(false);
    const [sessions, setSessions] = createSignal<Session[]>([]);
    const state = createMemo(() => useGlobalState());
    const t = useTranslate();

    const toggleIp = (e: Event) => {
        // TODO: implement this
    };

    const logoutAll = () => {
        const session = state().get("session");
        if (!session) return console.error("No session found");
        session.logoutAll();
    };

    const revoke = (id: string) => {
        const session = state().get("session");
        if (!session) return console.error("No session found");
        session.logout(id).then(() => {
            const newSessions = sessions().filter(s => s.id !== id);
            setSessions(newSessions);
        }).catch(() => {
            console.error("Failed to revoke session");
        });
    }

    onMount(async () => {
        const session = state().get("session");
        if (!session) return console.error("No session found");
        const sessions = await session.getAllSessions();
        setSessions(sessions);
    });

    return (
        <>
            <h1>{t("SESSIONS")}</h1>
            <Section>
                <Box type="warning">
                    <p>
                        IP address logging is disabled by default. If you enable this feature, Nextflow will store the IP address of future active sessions. Disabling this feature will delete all such information.
                    </p>
                    <br />
                    <p>For now, this setting will have no effect as this feature is not yet implemented.</p>
                </Box>
                <SwitchContainer>
                <Switch onChange={toggleIp} checked={ipLogging} setChecked={setIpLogging}  /> <span>Enable IP address logging</span></SwitchContainer>
            </Section>
            <Section>
                <Box type="error">
                    <p>
                        {t("LOGOUT_ALL_DESCRIPTION")}
                    </p>
                </Box>
                <Button onClick={logoutAll}>{t("LOGOUT_ALL")}</Button>
            </Section>
            <SessionList>
                <thead>
                    <tr>
                        <th>{t("ID")}</th>
                        <th>{t("FRIENDLY_NAME")}</th>
                        <th>Logged in</th>
                        <th>IP address</th>
                        <th>Location</th>
                        <th>{t("ACTIONS")}</th>
                    </tr>
                </thead>
                <SessionItems>
                    {sessions().map(session => (
                        <tr>
                            <td>{session.id}</td>
                            <td>{session.friendlyName}</td>
                            <td>{new Date(decodeTime(session.id)).toLocaleString(new Intl.Locale("zh-CN"))}</td>
                            <td>{session.ipAddress}</td>
                            <td>{session.location}</td>
                            <td>
                                <Button onClick={() => revoke(session.id)}>Revoke</Button>
                            </td>
                        </tr>
                    ))}
                </SessionItems>
            </SessionList>
        </>
    );
};

export default Sessions;