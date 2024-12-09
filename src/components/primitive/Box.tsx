import { ParentProps } from "solid-js";
import { styled } from "solid-styled-components";


const SuccessBox = styled.div`
    /* background-color: rgb(20 83 45);
    border-color: rgb(74 222 128); */
    background-color: #86efac;
    border-color: #22c55e 2px solid;
    border-radius: 0.375rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
`;

const InformationBox = styled.div`
    /* background-color: rgb(30 58 138); */
    /* border-color: rgb(96 165 250); */
    background-color: #7dd3fc;
    border: #0ea5e9 2px solid;
    border-radius: 0.375rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
`;

const ErrorBox = styled.div`
    /* background-color: rgb(139 0 0);
    border-color: rgb(255 0 0); */
    background-color: #ff7b7b;
    border: #ff0000 2px solid;
    border-radius: 0.375rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
`;

const WarningBox = styled.div`
    /* background-color: rgb(138 138 0);
    border-color: rgb(255 255 0); */
    background-color: #f5f5a5;
    border: #ffff00 2px solid;
    border-radius: 0.375rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
`;

const Box = (props: ParentProps<{ type: "success" | "error" | "warning" | "information" }>) => {
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
    } else
    if (props.type === "error") {
        return (
            <ErrorBox>
                {props.children}
            </ErrorBox>
        );
    } else
    if (props.type === "warning") {
        return (
            <WarningBox>
                {props.children}
            </WarningBox>
        );
    }
    return (
        <div>
            {props.children}
        </div>
    );
    
};

export default Box;
