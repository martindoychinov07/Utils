import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Input } from "./Input.tsx";
import { useI18n } from "../context/i18n/useI18n.tsx";
export function LayoutInput(props) {
    var _a, _b, _c, _d, _e, _f;
    const { t } = useI18n();
    let name;
    switch (props.item.type) {
        case "button":
        case "submit":
        case "reset":
        case "toggle":
        case "confirm":
            name = (_a = props.name) !== null && _a !== void 0 ? _a : props.item.name;
            break;
        default:
            name = ((_b = props.name) !== null && _b !== void 0 ? _b : [props.item.group, props.item.name].filter(p => p).join("."));
    }
    return (_jsx("div", { className: `col-span-${Math.min((_c = props.item.span) !== null && _c !== void 0 ? _c : 1, 2)} lg:col-span-${(_d = props.item.span) !== null && _d !== void 0 ? _d : 1} ${props.item.mode === "hidden" ? "hidden" : ""}`, children: props.item.name
            ? _jsx(Input, { form: props.form, name: name, type: props.item.type, prefix: t(props.item.label), disabled: (_e = props.disabled) !== null && _e !== void 0 ? _e : props.item.mode === "disabled", autoComplete: "off", rules: props.item.rules, formatter: props.formatter, format: props.item.format, options: props.options, action: props.item.source, variant: props.variant }, name)
            : _jsx(_Fragment, { children: props.item.label }) }, (_f = props.item.name) !== null && _f !== void 0 ? _f : props.index));
}
//# sourceMappingURL=LayoutInput.js.map