import { styled } from "solid-styled-components";
import Input from "../../components/primitive/Input";
import { Section } from "../ManageAccount";
import AvatarPicker from "../../components/AvatarPicker";
import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import Dialog from "@corvu/dialog";
import { useGlobalState } from "../../context";
import Button from "../../components/primitive/Button";

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

const AvatarConfigurator = styled.div`
display:flex;
flex-direction:column;
& > * + * {
    margin-top: 10px;
}
`;


const Profile = () => {
    const [stagedImage, setStagedImage] = createSignal<Image>();
    const dialogContext = createMemo(() => Dialog.useContext());
    const state = createMemo(() => useGlobalState());
    const [displayName, setDisplayName] = createSignal<string>("");
    const [description, setDescription] = createSignal<string>("");
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

    onMount(async () => {
        const session = state().session;
        if (!session) return console.error("No session found");
        const user = await session.getSettings();
        state().updateSettings(user);
        setDisplayName(user.displayName);
        setDescription(user.description);
    });

    createEffect(() => {
        const session = state().session;
        if (!session) return console.error("No session found");
        session.commitProfile({
            displayName: displayName(),
            description: description(),
        });
    });
    
    return (
        <>
            <h1>Profile</h1>
            <Section>
                <AvatarConfigurator>
                    <AvatarContainer onClick={handleAvatarChange}>
                        <img src={`https://cdn.nextflow.cloud/stores/avatars/files/1.png`} alt="avatar" />
                    </AvatarContainer>
                    <Button>Remove avatar</Button>
                </AvatarConfigurator>
            </Section>
            <Section>
                <Input placeholder="Display name" loading={false} value={displayName()} onChange={e => setDisplayName((e.target as HTMLInputElement).value)}  />
                <Input placeholder="Profile description" loading={false} value={description()} onChange={e => setDescription((e.target as HTMLInputElement).value)}  />
            </Section>
            <AvatarPicker stagedImage={stagedImage} />
        </>
    )
};

export default Profile;