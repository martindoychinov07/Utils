import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Input } from "./Input";
import { useI18n } from "../context/i18n/useI18n";
export function LayoutInput(props) {
    const { t } = useI18n();
    let name;
    switch (props.item.type) {
        case "button":
        case "submit":
        case "reset":
        case "toggle":
        case "confirm":
            name = props.name ?? props.item.name;
            break;
        default:
            name = (props.name ?? [props.item.group, props.item.name].filter(p => p).join("."));
    }
    return (_jsx("div", { className: `col-span-${Math.min(props.item.span ?? 1, 2)} lg:col-span-${props.item.span ?? 1} ${props.item.mode === "hidden" ? "hidden" : ""}`, children: props.item.name
            ? _jsx(Input, { form: props.form, name: name, type: props.item.type, prefix: t(props.item.label), disabled: props.disabled ?? props.item.mode === "disabled", autoComplete: "off", rules: props.item.rules, formatter: props.formatter, format: props.item.format, options: props.options, action: props.item.source, variant: props.variant }, name)
            : _jsx(_Fragment, { children: props.item.label }) }, props.item.name ?? props.index));
}
//# sourceMappingURL=LayoutInput.js.map