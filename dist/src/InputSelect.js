import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { get } from "react-hook-form";
import { useI18n } from "../context/i18n/useI18n.tsx";
import { toClassName } from "./useFormat.tsx";
export function InputSelect(props) {
    const { t } = useI18n();
    const [options, setOptions] = useState();
    const { register } = props.form;
    let prefix = props.prefix;
    if (!props.variant || !["label", "compact", "title"].includes(props.variant)) {
        prefix = undefined;
    }
    useEffect(() => {
        async function load() {
            var _a;
            try {
                setOptions(await ((_a = props.options) === null || _a === void 0 ? void 0 : _a.call(props, props.entry)));
            }
            catch (e) {
                console.error(e);
            }
        }
        load();
    }, [props.options, props.entry]);
    const error = get(props.form.formState.errors, props.name);
    const isInvalid = !!error;
    const cn = [
        { addIf: true, add: "w-full" },
        { addIf: true, add: "select select-sm" },
        { addIf: props.variant === "label", add: "" },
        { addIf: props.variant === "title", add: "select-title" },
        { addIf: props.variant === "ghost", add: "select-ghost" },
        { addIf: isInvalid, add: "field-state-invalid" },
    ];
    let dataTooltip = {};
    if (isInvalid) {
        const message = (error === null || error === void 0 ? void 0 : error.type) === "required"
            ? "~validation.required"
            : String(error === null || error === void 0 ? void 0 : error.message);
        dataTooltip = {
            "title": t(message)
            // "data-tooltip-id": "tooltip",
            // "data-tooltip-content": t(message),
            // "data-tooltip-place": "bottom-start",
        };
    }
    return (_jsxs("label", { className: toClassName(cn), ...dataTooltip, children: [prefix && _jsx("span", { className: "label", children: prefix }), _jsx("select", { ...register(props.name, props.rules), disabled: props.disabled, className: "field-input", autoComplete: props.autoComplete, children: options === null || options === void 0 ? void 0 : options.map((opt, index) => {
                    var _a;
                    return (_jsx("option", { value: opt.value, disabled: opt.disabled, children: t(opt.label) }, (_a = opt.value) !== null && _a !== void 0 ? _a : index));
                }) }, `${props.name}_${options === null || options === void 0 ? void 0 : options.length}`)] }));
}
//# sourceMappingURL=InputSelect.js.map