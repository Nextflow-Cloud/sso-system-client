import { useRef } from "preact/hooks";

interface Button {
    text: string;
    primary?: boolean;
    onClick?: () => void;
    id: string;
}

interface Props {
    title: string;
    content: string;
    buttons: Button[];
    // eslint-disable-next-line no-unused-vars
    onClose: (id: string, checkbox?: boolean) => void;
    checkbox?: string;
}

export type { Button, Props };

const ModalDialog = ({ title, content, onClose, buttons, checkbox }: Props) => {
    const checkboxRef = useRef<HTMLInputElement>(null);
    return (
        <div class="fixed inset-0 flex items-center justify-center bg-slate-400 bg-opacity-50 backdrop-blur-sm" onContextMenu={e => e.preventDefault()}>
            <div class="rounded-md bg-white p-5 drop-shadow-lg opacity-100">
                <div class="flex flex-col space-y-4">
                    <div class="flex flex-row items-center justify-between">
                        <h2 class="text-2xl font-semibold">
                            {title}
                        </h2>
                    </div>
                    <div class="flex flex-col">
                        {content}
                    </div>
                    {checkbox && (
                        <div class="flex space-x-2">
                            <input type="checkbox" />
                            <span>{checkbox}</span>
                        </div>
                    )}
                    <div class="flex flex-row justify-end">
                        {buttons.map(button => (
                            <button key={button.id} class={`px-4 py-2 mx-2 rounded-md ${button.primary ? "bg-gray-300 hover:bg-gray-400" : "bg-green-500 hover:bg-green-600"}`} onClick={() => onClose(button.id, checkboxRef.current?.checked)}>
                                {button.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalDialog;
