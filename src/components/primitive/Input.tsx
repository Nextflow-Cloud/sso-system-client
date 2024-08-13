import { createSignal, JSX } from "solid-js";
import { styled } from "solid-styled-components";

const InputContainer = styled.div`
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    position:relative;
`;

const InputBase = styled.input`
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.375rem;
    background-color: transparent;
    margin-bottom: 0.5rem;  
    /* :hover {
        border-color: rgb(74 222 128);
    } */
    &:focus {
        border: var(--secondary) 1px solid;
    }
    border: var(--foreground-border) 1px solid;
    
    /* :disabled {
        border: #e5e7eb 1px solid;
    } */
    transition: 50ms ease-in-out;
`;

const InputLabel = styled.label`
    color: var(--foreground);
    background: transparent;
    font-size: 0.875rem;
    /* margin-bottom: 0.25rem;
    display: block; */
    position:absolute;
    left:0;
    top:0;
    margin: 0.5rem;
    pointer-events: none;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    transition: 0.2s ease-in-out;
    border-radius: 5px;
    ${(props: { focused: boolean; empty: boolean }) => props.focused || !props.empty ? `
        font-size: 0.75rem;
        transform: translateY(-100%);
        background: white;
        color: var(--secondary);
        ` : ""}
        
`;


interface Props { 
    loading: boolean;
    password?: boolean;
    placeholder?: string; 
    onKeyDown?: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent>; 
    value?: string;
    onChange?: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event>;
}

const Input = (props: Props) => {
    const [focused, setFocused] = createSignal(false);
    const [empty, setEmpty] = createSignal(props.value === "");
    return (
        <InputContainer>
            <InputBase
                type={props.password ? "password" : "text"}
                disabled={props.loading}
                onKeyDown={props.onKeyDown}
                value={props.value}
                onChange={e => {
                    props.onChange && (props.onChange as Function)(e);
                    setEmpty(e.target.value === "");
                }}
                onFocusIn={() => setFocused(true)}
                onFocusOut={() => setFocused(false)}
            />
            <InputLabel focused={focused()} empty={empty()}>{props.placeholder}</InputLabel>
        </InputContainer>
    );
};

export default Input;
