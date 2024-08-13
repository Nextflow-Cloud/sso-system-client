import { styled } from "solid-styled-components";
import Button from "../../components/primitive/Button";
import Input from "../../components/primitive/Input";
import { Section } from "../ManageAccount";
import Switch, { SwitchContainer } from "../../components/primitive/Switch";
import Box from "../../components/primitive/Box";
import { createSignal } from "solid-js";

const Account = () => {
    const [username, setUsername] = createSignal<string>("");
    const [newPassword, setNewPassword] = createSignal<string>("");
    return (
        <>
        
            <h1>Manage account</h1>
            <Section>
                <Input placeholder="Username" loading={false} value={username()} onChange={e => setUsername((e.target as HTMLInputElement).value)} />
                <Input placeholder="New password" loading={false} value={newPassword()} onChange={e => setNewPassword((e.target as HTMLInputElement).value)} />
                <Button>Commit</Button>
            </Section>
            <Section>
                <Box type="warning">
                    Two factor authentication is highly recommended to secure your account.
                </Box>
                <SwitchContainer>
                    <Switch />
                    <span>Two factor authentication</span>
                </SwitchContainer>
                <Box type="error">
                    <h2>Danger zone</h2>
                    <p>
                        Nextflow is committed to your privacy and security. Your data will be removed from our servers as soon as possible.
                    </p>
                </Box>
                <Button>Delete account</Button>
            </Section>
        </>
    )
};

export default Account;