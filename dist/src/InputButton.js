import { jsx as _jsx } from "react/jsx-runtime";
import { toClassName } from "./useFormat.tsx";
export function InputButton(props) {
    // const form = props.form;
    // const { register } = form;
    var _a, _b;
    let type = props.type;
    if (props.type === "button" || props.type === "confirm") {
        type = "submit";
    }
    const actionValue = (_b = (_a = props.action) !== null && _a !== void 0 ? _a : props.name) !== null && _b !== void 0 ? _b : "true";
    const cn = [
        { addIf: true, add: "w-full btn btn-sm btn-primary" },
        { addIf: !!props.disabled, add: "btn-disabled" },
        { addIf: props.variant === "ghost", add: "btn-ghost" },
        { addIf: props.variant === "title", add: "btn-title" },
    ];
    return (_jsx("button", { type: type, name: "action", value: actionValue, disabled: props.disabled, className: toClassName(cn), children: props.prefix }));
}
//# sourceMappingURL=InputButton.js.map