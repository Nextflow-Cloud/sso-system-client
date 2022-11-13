import { ComponentChildren, JSX } from "preact";
import styled from "styled-components";

const LinkBase = styled.a`
    color: rgb(96 165 250);
    text-decoration: none;
`;

const Link = (props: { children: ComponentChildren; href: string; onClick: JSX.MouseEventHandler<HTMLAnchorElement> }) => {
    return (
        <LinkBase href={props.href} onClick={props.onClick}>
            {props.children}
        </LinkBase>
    );
};

export default Link;
