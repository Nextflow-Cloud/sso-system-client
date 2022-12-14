import { JSX } from "preact";
import styled from "styled-components";

const InputContainer = styled.div`
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
`;

const InputBase = styled.input`
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.375rem;
    background-color: rgb(30 41 59);
    margin-bottom: 0.5rem;
    :focus {
        border-color: rgb(74 222 128);
        outline: none;
    }
    :hover {
        border-color: rgb(74 222 128);
    }
    border: #e5e7eb 1px solid;
    :disabled {
        border: #e5e7eb 1px solid;
    }
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 250ms;
`;

interface Props { 
    loading: boolean;
    password?: boolean;
    placeholder?: string; 
    onKeyDown?: JSX.KeyboardEventHandler<HTMLInputElement>; 
    value?: string;
    onChange?: JSX.GenericEventHandler<HTMLInputElement>;
}

const Input = (props: Props) => {
    return (
        <InputContainer>
            <InputBase
                type={props.password ? "password" : "text"}
                placeholder={props.placeholder}
                disabled={props.loading}
                onKeyDown={props.onKeyDown}
                value={props.value}
                onChange={props.onChange}
            />
        </InputContainer>
    );
};

export default Input;
