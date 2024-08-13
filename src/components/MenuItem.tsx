import { useNavigate } from "@solidjs/router";
import { IconTypes } from "solid-icons";
import { styled } from "solid-styled-components";

const MenuItemBase = styled.div`
    display: flex;
    flex-direction: row;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 3px;
    padding-bottom: 3px;
    border-radius: 5px;
    & > * + * {
        margin-left: 10px;
    }
    align-items: center;
    &:hover {
        background-color: var(--secondary-a);
    }

    cursor: default;
    user-select: none;
    ${({ active }: { active?: boolean }) => active ? `
        background-color: var(--secondary-light);
        &:hover {
            background-color: var(--secondary-light);
        }
    ` : ""}
`;

const MenuItem = (props: { id: string; name: string; active: string; Icon: IconTypes }) => {
    const navigate = useNavigate();
    return (
        <MenuItemBase active={props.active === props.id} onClick={() => navigate(`/manage/${props.id}`)}>
            <props.Icon />
            <div>{props.name}</div>
        </MenuItemBase>
    );
}

export default MenuItem;