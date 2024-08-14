import Dialog from "@corvu/dialog";
import { styled } from "solid-styled-components";

export const Overlay = styled(Dialog.Overlay)`
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

export const Content = styled(Dialog.Content)`
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
    max-width: 1000px;
`;
