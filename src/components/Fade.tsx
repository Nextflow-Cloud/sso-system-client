import { ParentProps } from "solid-js";
import { styled } from "solid-styled-components";

const FadeBase = styled.div`
    animation: ${(props: { hiding: boolean; }) => props.hiding ? "1s fadeOutLeft" : "1s fadeInRight"};
    display: flex;
    flex-direction: column;
    height: 100%;
    /* justify-content: space-between; */
    & > :not([hidden]) ~ :not([hidden]) {
        margin-top: 0.75rem;
    }
    word-wrap: break-word;
    font-size: 0.875rem;
`;

const Fade = (props: ParentProps<{ hiding: boolean; }>) => {
    return (
        <FadeBase hiding={props.hiding}>
            {props.children}
        </FadeBase>
    );
};

export default Fade;
