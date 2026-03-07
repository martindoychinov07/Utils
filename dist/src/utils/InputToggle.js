import { jsx as _jsx } from "react/jsx-runtime";
import { toClassName } from "./useFormat";
export function InputToggle(props) {
    const { register } = props.form;
    const cn = [
        { addIf: true, add: "w-full btn btn-sm" },
        { addIf: !!props.disabled, add: "btn-disabled" },
        { addIf: props.variant === "ghost", add: "btn-ghost" },
    ];
    return (_jsx("input", { ...register(props.name), type: "checkbox", "aria-label": props.prefix?.toString(), disabled: props.disabled, className: toClassName(cn), value: props.action ?? "true" }));
}
//# sourceMappingURL=InputToggle.js.map