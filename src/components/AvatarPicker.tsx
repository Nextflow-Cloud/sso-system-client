import Dialog from "@corvu/dialog";
import { Accessor, createMemo, onMount } from "solid-js";
import { styled } from "solid-styled-components";
import Button from "./primitive/Button";
import { uploadAvatar } from "../utilities/lib/cdn";
import { Image } from "../routes/manage/Profile";
import { Content, Overlay } from "./Dialog";

const StagedImage = styled.img`
    width: 200px;
    height: 200px;
    border-radius: 10px;
    object-fit: cover;

`;


const AvatarPicker = (props: { stagedImage: Accessor<Image | undefined>; }) => {
    const dialogContext = createMemo(() => Dialog.useContext());
    const closeDialog = () => {
        dialogContext().setOpen(false);
    };

    const save = () => {
        dialogContext().setOpen(false);
        // Save the image
        uploadAvatar(props.stagedImage()!.file);
    }

    return (
        <Dialog.Portal>
            <Overlay />
            <Content>
                <h1>Avatar Picker</h1>
                <StagedImage src={props.stagedImage()?.url} alt="staged avatar" />
                <Button onClick={closeDialog}>Cancel</Button>
                <Button onClick={save}>Save</Button>
            </Content>
        </Dialog.Portal>
    );
};
export default AvatarPicker;