import { JSX, ParentProps } from "solid-js";
import { styled } from "solid-styled-components";


const LinkBase = styled.a`
    color: rgb(96 165 250);
    text-decoration: none;
`;

const Link = (props: ParentProps<{ href: string; onClick?: JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent> }>) => {
    return (
        <LinkBase href={props.href} onClick={props.onClick}>
            {props.children}
        </LinkBase>
    );
};

export default Link;
