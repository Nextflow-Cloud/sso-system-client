
import { Section } from "../ManageAccount";
import Box from "../../components/primitive/Box";
import Switch, { SwitchContainer } from "../../components/primitive/Switch";
import Button from "../../components/primitive/Button";
import { decodeTime, monotonicFactory } from "ulid";
import { createSignal } from "solid-js";

interface Session {
    id: string,
    friendlyName: string,
    ipAddress: string,
    location: string,
}

const sample: Session[] = [{ 
    id: "01J56F2RCGRQC4SNAA02SYSED3",
    friendlyName: "Nextflow Desktop",
    ipAddress: "192.168.0.1",
    location: "Unknown",
}];

const Sessions = () => {
    const [ipLogging, setIpLogging] = createSignal<boolean>(false);
    const [sessions, setSessions] = createSignal<Session[]>(sample);

    const toggleIp = (e: Event) => {
        (e.target as HTMLInputElement).checked ? setIpLogging(true) : setIpLogging(false);
        // TODO: context for current session    
    }

    const logoutAll = () => {
        // logout all
    }

    return (
        <>
            <h1>Sessions</h1>
            <Section>
                <Box type="warning">
                    <p>
                        IP address logging is disabled by default. If you enable this feature, Nextflow will store the IP address of future active sessions. Disabling this feature will delete all such information.
                    </p>
                </Box>
                <SwitchContainer>
                <Switch onChange={toggleIp} checked={ipLogging()} /> <span>Enable IP address logging</span></SwitchContainer>
            </Section>
            <Section>
                <Box type="error">
                    <p>
                        This will log you out of all active sessions except the current one. You will need to log in again.
                    </p>
                </Box>
                <Button onClick={logoutAll}>Logout all sessions</Button>
            </Section>
            <table>
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
                <tbody>
                    {sessions().map(session => (
                        <tr>
                            <td>{session.id}</td>
                            <td>{session.friendlyName}</td>
                            <td>{new Date(decodeTime(session.id)).toLocaleString(new Intl.Locale("zh-CN"))}</td>
                            <td>{session.ipAddress}</td>
                            <td>{session.location}</td>
                            <td>
                                <Button>Revoke</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Sessions;