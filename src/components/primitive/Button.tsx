import { ComponentChildren, JSX, Ref } from "preact";

const Button = (props: { children: ComponentChildren; onClick?: JSX.MouseEventHandler<HTMLDivElement>, divRef?: Ref<HTMLDivElement>, disabled?: boolean }) => {
    return (
        <div class={`rounded-lg hover:bg-opacity-60 p-2 text-white text-center cursor-default select-none ${props.disabled ? "bg-gray-400" : "bg-green-500 hover:bg-green-400"}`} onClick={props.disabled ? () => void 0 : props.onClick} ref={props.divRef} disabled={props.disabled}>
            {props.children}
        </div>
    );
};

export default Button;
