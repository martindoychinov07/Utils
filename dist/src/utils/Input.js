import { jsx as _jsx } from "react/jsx-runtime";
import { InputSelect } from "./InputSelect";
import { InputButton } from "./InputButton";
import InputCommon from "./InputCommon";
import { InputToggle } from "./InputToggle";
import { ModalIcon } from "./modal/ModalIcon";
export function Input(props) {
    switch (props.type) {
        case "select":
            return InputSelect(props);
        case "button":
        case "submit":
        case "reset":
        case "confirm":
            return InputButton(props);
        case "toggle":
            return InputToggle(props);
        case "date":
        case "datetime":
        case "datetime-local":
        case "dialog":
            return InputCommon({
                ...props,
                type: "text",
                suffix: InputButton({
                    ...props,
                    prefix: _jsx(ModalIcon, {}),
                    type: "button",
                    name: "action",
                    action: [props.action, props.name].filter(s => s).join(":"),
                    variant: "ghost",
                })
            });
    }
    return InputCommon(props);
}
//# sourceMappingURL=Input.js.map