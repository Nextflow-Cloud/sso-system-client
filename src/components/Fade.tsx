import { ComponentChildren } from "preact";
import styled from "styled-components";

const FadeBase = styled.div`
    animation: ${(props: { hiding: boolean; }) => props.hiding ? "1s fadeOutLeft" : "1s fadeInRight"};
    display: flex;
    flex-direction: column;
    height: 100%;
    /* justify-content: space-between; */
    & > :not([hidden]) ~ :not([hidden]) {
        margin-top: 1rem;
    }
    word-wrap: break-word;
`;

const Fade = (props: { children: ComponentChildren; hiding: boolean; }) => {
    return (
        <FadeBase hiding={props.hiding}>
            {props.children}
        </FadeBase>
    );
};

export default Fade;
