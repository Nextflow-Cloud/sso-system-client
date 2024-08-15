import { Accessor, Setter, JSX } from "solid-js";
import { styled } from "solid-styled-components";

const SwitchBase = styled.label`
    position: relative;
    display: inline-block;
    width: 40px;
    height: 24px;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    margin-right: 0.2rem;
`;

const Slider = styled.span`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 5px;
    transition: 0.2s;
    
    ${(props: { checked: boolean }) => props.checked ? `
        /*background-color: #6b21f3;*/
        background-color: var(--secondary);
    ` : ""}
    &:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        border-radius: 5px;
        transition: 0.2s;
        ${(props: { checked: boolean }) => props.checked ? `
            transform: translateX(16px);
        ` : ""}
    }
`
// TODO: add a disabled state
/** A switch component. An Accessor and Setter managing the checked state must be passed down for proper state management. */
const Switch = ({ checked, setChecked, onChange }: { checked: Accessor<boolean|undefined>|Accessor<boolean>; setChecked: Setter<boolean|undefined>|Setter<boolean>; onChange?: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> }) => {
    return (
        <SwitchBase>
            <input type="checkbox" checked={checked()} onChange={e => {
                (setChecked as Setter<boolean>)(e.currentTarget.checked);
                (onChange as Function | undefined)?.(e);
            }} />
            <Slider checked={checked()??false} />
        </SwitchBase>
    )
};

export const SwitchContainer = styled.div`
    display: flex;
    & > * + * {
        margin-left: 5px;
    }
    align-items: center;
`;


export default Switch;
