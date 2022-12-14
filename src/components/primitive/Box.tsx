import { ComponentChildren } from "preact";
import styled from "styled-components";

const SuccessBox = styled.div`
    background-color: rgb(20 83 45);
    border-color: rgb(74 222 128);
    border-radius: 0.375rem;
    border-width: 2px;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
`;

const InformationBox = styled.div`
    background-color: rgb(30 58 138);
    border-color: rgb(96 165 250);
    border-radius: 0.375rem;
    border-width: 2px;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
`;

const Box = (props: { children: ComponentChildren, type: "success" | "error" | "warning" | "information" }) => {
    if (props.type === "success") {
        return (
            <SuccessBox>
                {props.children}
            </SuccessBox>
        );
    } else
    if (props.type === "information") {
        return (
            <InformationBox>
                {props.children}
            </InformationBox>
        );
    } 
    return (
        <div>
            {props.children}
        </div>
    );
    
};

export default Box;
