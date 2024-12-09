import { styled } from "solid-styled-components";
import Input from "../../components/primitive/Input";
import { Section } from "../ManageAccount";
import AvatarPicker from "../../components/AvatarPicker";
import { Accessor, createMemo, createSignal, onMount, Setter } from "solid-js";
import Dialog from "@corvu/dialog";
import { useGlobalState } from "../../context";
import Button from "../../components/primitive/Button";
import { useTranslate } from "../../utilities/i18n";

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


const Profile = ({ loading, setLoading }: { loading: Accessor<boolean>; setLoading: Setter<boolean>; }) => {
    const [stagedImage, setStagedImage] = createSignal<Image>();
    const dialogContext = createMemo(() => Dialog.useContext());
    const state = createMemo(() => useGlobalState());
    const [displayName, setDisplayName] = createSignal<string>();
    const [description, setDescription] = createSignal<string>();
    const t = useTranslate();
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
        setLoading(true);
        let settings = state().get("settings");
        if (!settings) {
            const session = state().get("session");
            if (!session) return console.error("No session found");
            const user = await session.getSettings();
            settings = user;
            state().set("settings", user);
        }
        setDisplayName(settings.displayName);
        setDescription(settings.description);
        setLoading(false);
    });

    const save = () => {
        let existingSettings = state().get("settings");
        if (!existingSettings) return;
        let dn = displayName()?.trim();
        let desc = description()?.trim();
        if (existingSettings.displayName === dn && existingSettings.description === desc) return;
        if (!dn) return;
        if (dn.length > 64) { // TODO: errors
            return;
        }
        // 256 for now, but 2048 server side
        if (desc && desc.length > 256) { // TODO: make this a constant
            return;
        }
        const session = state().get("session");
        if (!session) return console.error("No session found");
        session.commitProfile({
            displayName: displayName(),
            description: description(),
        });
        state().update("settings", {
            displayName: displayName(),
            description: description(),
        });
    };
    
    return (
        <>
            <h1>Profile</h1>
            <Section>
                <AvatarConfigurator>
                    <AvatarContainer onClick={handleAvatarChange}>
                        <img src={`https://cdn.nextflow.cloud/stores/avatars/files/1.png`} alt="avatar" />
                    </AvatarContainer>
                    <Button>{t("REMOVE_AVATAR")}</Button>
                </AvatarConfigurator>
            </Section>
            <Section>
                <Input placeholder={t("DISPLAY_NAME")} loading={loading()} value={displayName()} onChange={e => setDisplayName((e.target as HTMLInputElement).value)}  />
                <Input placeholder={t("PROFILE_DESCRIPTION")} loading={loading()} value={description()} onChange={e => setDescription((e.target as HTMLInputElement).value)}  />
                <Button onClick={save} disabled={loading()}>{t("SAVE")}</Button>
            </Section>
            <AvatarPicker stagedImage={stagedImage} />
        </>
    )
};

export default Profile;