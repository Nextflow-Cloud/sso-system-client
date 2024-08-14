import OtpField from "@corvu/otp-field";
import { Accessor, Setter, Show } from "solid-js";
import { styled } from "solid-styled-components";

const StyledOtpField = styled(OtpField)`
    display: flex;
    font-size: 2rem;
    margin-top: 5px;
    margin-bottom: 5px;
`;

const OtpInput = (props: { code: Accessor<string>; setCode: Setter<string>; }) => {
    return (
        <div>
            <StyledOtpField maxLength={8}>
                <OtpField.Input aria-label="Verification Code" value={props.code()} onChange={(e: { target: HTMLInputElement; }) => props.setCode((e.target as HTMLInputElement).value)}  />
                <Slot index={0} />
                <Slot index={1} />
                <Slot index={2} />
                <Slot index={3} />
                <Slot index={4} />
                <Slot index={5} />
                <Slot index={6} />
                <Slot index={7} />
            </StyledOtpField>
        </div>
    );
};

const SlotBase = styled.div`
padding-left: 5px;
padding-right: 5px;
border: 1px var(--secondary) solid;
border-radius: 5px;
min-height: 3rem;
margin-right: 5px;
width:40px;
display: flex;
justify-content: center;
`;

  
const Slot = (props: { index: number }) => {
    const context = OtpField.useContext();
    const char = () => context.value()[props.index];
    const showFakeCaret = () =>
        context.value().length === props.index && context.isInserting();
  
    return (
        <SlotBase>
            {char()}
            <Show when={showFakeCaret()}>
                <span>|</span>
            </Show>
        </SlotBase>
    );
};

export default OtpInput;
