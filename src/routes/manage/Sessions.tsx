
import { Section } from "../ManageAccount";
import Box from "../../components/primitive/Box";
import Switch, { SwitchContainer } from "../../components/primitive/Switch";
import Button from "../../components/primitive/Button";
import { decodeTime } from "ulid";
import { createMemo, createSignal, onMount } from "solid-js";
import { useGlobalState } from "../../context";
import { Session } from "../../utilities/lib/authentication";
import { styled } from "solid-styled-components";

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
            <h1>Sessions</h1>
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
                        This will log you out of all active sessions except the current one. You will need to log in again.
                    </p>
                </Box>
                <Button onClick={logoutAll}>Logout all sessions</Button>
            </Section>
            <SessionList>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Friendly name</th>
                        <th>Logged in</th>
                        <th>IP address</th>
                        <th>Location</th>
                        <th>Actions</th>
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