import { JSX, ParentProps } from "solid-js";
import { styled } from "solid-styled-components";


const ButtonBase = styled.button`
    border-radius: 0.5rem;
    padding: 0.5rem;
    color: white;
    text-align: center;
    cursor: default;
    user-select: none;
    background-color: var(--secondary);
    &:hover {
        filter: brightness(0.85);
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

const Button = (props: ParentProps<{ onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>, disabled?: boolean }>) => {
    return (
        <ButtonBase onClick={props.onClick} disabled={props.disabled} type="submit">
            {props.children}
        </ButtonBase>
    );
};

export default Button;
