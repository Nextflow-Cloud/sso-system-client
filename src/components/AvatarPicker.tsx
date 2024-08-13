import Dialog from "@corvu/dialog";
import { Accessor, createMemo, onMount } from "solid-js";
import { styled } from "solid-styled-components";
import Button from "./primitive/Button";
import { uploadAvatar } from "../utilities/lib/cdn";
import { Image } from "../routes/manage/Profile";

const Overlay = styled(Dialog.Overlay)`
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const Content = styled(Dialog.Content)`
    position:fixed;
    left:50%;
    top:50%;
    z-index: 1001;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
     & > * + * {
        margin-top: 10px;
    }
`;

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