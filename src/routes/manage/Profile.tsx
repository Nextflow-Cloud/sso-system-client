import { styled } from "solid-styled-components";
import Input from "../../components/primitive/Input";
import { Section } from "../ManageAccount";

const AvatarContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    width: 100px;
    height: 100px;
    border-radius: 10px;
    background-color: var(--secondary-a);
`;


const Profile = () => {

    const handleAvatarChange = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();
    };
    
    return (
        <>
            <h1>Profile</h1>
            <Section>
                <AvatarContainer onClick={handleAvatarChange}>
                    <img src={`https://cdn.nextflow.cloud/stores/avatars/files/1.png`} alt="avatar" />
                </AvatarContainer>
            </Section>
            <Section>
                <Input placeholder="Display name" loading={false} />
                <Input placeholder="Profile description" loading={false} />
            </Section>
        </>
    )
};

export default Profile;