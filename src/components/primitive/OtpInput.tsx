import OtpField from "@corvu/otp-field";
import { Accessor, Setter, Show } from "solid-js";

const OtpInput = (props: { code: Accessor<string>; setCode: Setter<string>; }) => {
    return (
        <div>
            <OtpField maxLength={8}  >
                <OtpField.Input aria-label="Verification Code" value={props.code()} onChange={(e: { target: HTMLInputElement; }) => props.setCode((e.target as HTMLInputElement).value)}  />
                <Slot index={0} />
                <Slot index={1} />
                <Slot index={2} />
                <Slot index={3} />
                <Slot index={4} />
                <Slot index={5} />
                <Slot index={6} />
                <Slot index={7} />
            </OtpField>
        </div>
    );
};
  
const Slot = (props: { index: number }) => {
    const context = OtpField.useContext();
    const char = () => context.value()[props.index];
    const showFakeCaret = () =>
        context.value().length === props.index && context.isInserting();
  
    return (
        <div>
            {char()}
            <Show when={showFakeCaret()}>
                <span>|</span>
            </Show>
        </div>
    );
};

export default OtpInput;
