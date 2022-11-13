import { ComponentChildren, JSX } from "preact";
import styled from "styled-components";

const ButtonBase = styled.button`
    border-radius: 0.5rem;
    padding: 0.5rem;
    color: white;
    text-align: center;
    cursor: default;
    user-select: none;
    background-color: #38a169;
    &:hover {
        background-color: #2f855a;
    }
    &:disabled {
        background-color: #cbd5e0;
    }
    width: 100%;

    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 250ms;
`;

const Button = (props: { children: ComponentChildren; onClick?: JSX.MouseEventHandler<HTMLDivElement>, disabled?: boolean }) => {
    return (
        <ButtonBase onClick={props.onClick} disabled={props.disabled} type="submit">
            {props.children}
        </ButtonBase>
    );
};

export default Button;
