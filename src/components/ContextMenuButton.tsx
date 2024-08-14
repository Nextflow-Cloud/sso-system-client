import { styled } from "solid-styled-components";

const ContextMenuButton = styled.button`
    background-color: transparent;
    color: black;
    border-radius: 0.5rem;
    padding: 0.5rem;
    text-align: center;
    cursor: default;
    user-select: none;
    &:hover {
        background-color: var(--secondary-a);
    }
    &:disabled {
        background-color: #cbd5e0;
    }
    width: 100%;

    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 250ms;
    border: none;
`;

export default ContextMenuButton;