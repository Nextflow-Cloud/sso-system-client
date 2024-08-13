import { styled } from "solid-styled-components";
import Input from "../../components/primitive/Input";
import { Section } from "../ManageAccount";
import AvatarPicker from "../../components/AvatarPicker";
import { createMemo, createSignal } from "solid-js";
import Dialog from "@corvu/dialog";

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

export interface Image {
    file: File,
    url: string,
}


const Profile = () => {
    const [stagedImage, setStagedImage] = createSignal<Image>();
    const dialogContext = createMemo(() => Dialog.useContext());
    const handleAvatarChange = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.addEventListener("change", e => {
            const file = (e.target as HTMLInputElement).files?.item(0);
            if (file) {
                const reader = new FileReader();
                reader.addEventListener("load", e => {
                    const result = e.target?.result;
                    setStagedImage({
                        file,
                        url: result as string,
                    });
                    dialogContext().setOpen(true);
                });
                reader.readAsDataURL(file);
            }
        })
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
            <AvatarPicker stagedImage={stagedImage} />
        </>
    )
};

export default Profile;