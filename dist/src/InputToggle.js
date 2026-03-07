import { jsx as _jsx } from "react/jsx-runtime";
import { toClassName } from "./useFormat.tsx";
export function InputToggle(props) {
    var _a, _b;
    const { register } = props.form;
    const cn = [
        { addIf: true, add: "w-full btn btn-sm" },
        { addIf: !!props.disabled, add: "btn-disabled" },
        { addIf: props.variant === "ghost", add: "btn-ghost" },
    ];
    return (_jsx("input", { ...register(props.name), type: "checkbox", "aria-label": (_a = props.prefix) === null || _a === void 0 ? void 0 : _a.toString(), disabled: props.disabled, className: toClassName(cn), value: (_b = props.action) !== null && _b !== void 0 ? _b : "true" }));
}
//# sourceMappingURL=InputToggle.js.map