import { ComponentChildren } from "preact";

const Button = (props: { children: ComponentChildren }) => {
    return (
        <button class="bg-green-500 hover:bg-green-400 ">
            {props.children}
        </button>
    );
};

export default Button;
