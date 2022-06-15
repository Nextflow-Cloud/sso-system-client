import { ComponentChildren, JSX, Ref } from "preact";

const Button = (props: { children: ComponentChildren; onClick?: JSX.MouseEventHandler<HTMLDivElement>, divRef: Ref<HTMLDivElement> }) => {
    return (
        <div class="rounded-lg hover:bg-opacity-60 p-2 text-white text-center bg-green-500 hover:bg-green-400 cursor-default select-none" onClick={props.onClick} ref={props.divRef}>
            {props.children}
        </div>
    );
};

export default Button;
