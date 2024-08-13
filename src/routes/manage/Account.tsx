import { styled } from "solid-styled-components";
import Button from "../../components/primitive/Button";
import Input from "../../components/primitive/Input";
import { Section } from "../ManageAccount";

const Account = () => {
    return (
        <>
        
            <h1>Manage Account</h1>
            <Section>
                <Input placeholder="Username" loading={false} />
                <Input placeholder="New password" loading={false} />
                <Button>Commit</Button>
            </Section>
        </>
    )
};

export default Account;