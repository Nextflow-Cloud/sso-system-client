import { JSX, ParentProps } from "solid-js";
import { styled } from "solid-styled-components";

const SelectMenuBase = styled.select`
    border-radius: 0.375rem;
    padding: 0.5rem;
    margin-top: 1.25rem;
    background-color: transparent;
    border-color: var(--foreground-border);
    border-style: solid;
    border-width: 1px;
`;

const SelectMenu = (props: ParentProps<{ onChange?: JSX.ChangeEventHandlerUnion<HTMLSelectElement, Event>; value?: string; }>) => {
    return (
        <SelectMenuBase onChange={props.onChange} value={props.value} id="id0">
            {props.children}
        </SelectMenuBase>
    );
};

export default SelectMenu;
