import { ParentProps } from "solid-js";
import { styled } from "solid-styled-components";


const SuccessBox = styled.div`
    /* background-color: rgb(20 83 45);
    border-color: rgb(74 222 128); */
    background-color: #86efac;
    border-color: #22c55e;
    border-radius: 0.375rem;
    border-width: 2px;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
`;

const InformationBox = styled.div`
    /* background-color: rgb(30 58 138); */
    /* border-color: rgb(96 165 250); */
    background-color: #0ea5e9;
    border-color: #7dd3fc;
    border-radius: 0.375rem;
    border-width: 2px;
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
    } 
    return (
        <div>
            {props.children}
        </div>
    );
    
};

export default Box;
