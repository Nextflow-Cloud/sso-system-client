import { ComponentChildren, JSX } from "preact";
import styled from "styled-components";

const SelectMenuBase = styled.select`
    border-radius: 0.375rem;
    padding: 0.5rem;
    margin-top: 1.25rem;
    background-color: rgb(30 41 59);
`;

const SelectMenu = (props: { children: ComponentChildren, onChange: JSX.GenericEventHandler<HTMLSelectElement>; value: string; }) => {
    return (
        <SelectMenuBase onChange={props.onChange} value={props.value} id="id0">
            {props.children}
        </SelectMenuBase>
    );
};

export default SelectMenu;
