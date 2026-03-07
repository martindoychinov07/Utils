import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { toClassName } from "./useFormat.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "../context/i18n/useI18n.tsx";
import { get } from "react-hook-form";
function InputCommon(props) {
    var _a;
    const { t } = useI18n();
    const focused = useRef(false);
    const { register, getValues, setValue } = props.form;
    const value = getValues(props.name);
    const format = t(props.format);
    // Reusable formatting function
    const formatValue = useCallback((value, normalize) => {
        // Apply custom formatter if provided
        if (props.formatter && format && value !== undefined) {
            const formatted = props.formatter(String(value !== null && value !== void 0 ? value : ""), format, normalize);
            if (formatted != null) {
                return formatted;
            }
        }
        return value;
    }, [props.type, props.formatter, format]);
    const [displayValue, setDisplayValue] = useState(() => formatValue(value));
    // Sync displayValue when fieldValue changes from external setValue
    useEffect(() => {
        if (value !== undefined && value !== null) {
            const formatted = formatValue(value);
            if (formatted !== undefined && formatted !== null && !focused.current) {
                setDisplayValue(formatted);
            }
        }
    }, [value, formatValue]);
    let prefix = props.prefix;
    if (!props.variant || !["label", "compact", "title"].includes(props.variant)) {
        prefix = undefined;
    }
    let rules;
    if (format) {
        const pattern = t(`${props.format}.pattern`);
        if (pattern && !pattern.startsWith("~")) {
            rules = {
                ...props.rules,
                pattern: {
                    value: new RegExp(pattern),
                    message: `${props.format}.message`
                },
            };
        }
    }
    else {
        rules = props.rules;
    }
    const error = get(props.form.formState.errors, props.name);
    const isInvalid = !!error;
    const cn = [
        { addIf: true, add: "w-full" },
        { addIf: ["button", "submit", "reset", "toggle"].includes(props.type), add: "btn btn-sm", orElse: "input input-sm" },
        { addIf: !!props.disabled && ["button", "submit", "reset"].includes(props.type), add: "btn-disabled" },
        { addIf: props.type === "hidden", add: "hidden" },
        { addIf: props.type === "number", add: "number" },
        { addIf: props.type === "checkbox" || props.type === "radio", add: "bg-base-100 border border-base-300" },
        { addIf: props.variant === "label", add: "" },
        { addIf: props.variant === "title", add: "input-title" },
        { addIf: props.variant === "ghost", add: "input-ghost" },
        { addIf: props.variant === "compact", add: "input-compact" },
        { addIf: !!props.action, add: "input-action" },
        { addIf: isInvalid, add: "field-state-invalid" },
    ];
    let dataTooltip = {};
    if (isInvalid) {
        const message = error.type === "required"
            ? "~validation.required"
            : String((_a = error.message) !== null && _a !== void 0 ? _a : "~validation.unknown");
        dataTooltip = {
            "title": t(message)
            // "data-tooltip-id": "tooltip",
            // "data-tooltip-content": t(message),
            // "data-tooltip-place": "bottom-start",
        };
    }
    else if (props.type !== "number") {
        dataTooltip = {
            "title": displayValue
        };
    }
    // Build registration options based on type
    const registrationOptions = {
        ...rules,
        // ...(props.type === "number" && {
        //   setValueAs: (value: any) => {
        //     const num = Number(formatValue(value, true));
        //     return Number.isNaN(num) ? "" : num;
        //   }
        // })
    };
    const handleBlur = (e) => {
        const formatted = formatValue(e.target.value, true);
        if (formatted !== undefined && formatted !== null && formatted !== e.target.value) {
            setDisplayValue(formatted);
            // props.form.clearErrors(props.name);
        }
        focused.current = false;
    };
    // For number type, use controlled input with displayValue
    // For other types, let react-hook-form handle it
    const registered = register(props.name, registrationOptions);
    const inputProps = props.format !== undefined
        ? {
            value: displayValue === undefined || displayValue === null ? "" : displayValue,
            onChange: (e) => {
                var _a;
                setDisplayValue(e.target.value);
                // Manually trigger react-hook-form's onChange
                (_a = registered.onChange) === null || _a === void 0 ? void 0 : _a.call(registered, e);
            },
            onBlur: (e) => {
                var _a;
                handleBlur(e);
                (_a = registered.onBlur) === null || _a === void 0 ? void 0 : _a.call(registered, e);
            },
            name: registered.name,
            ref: registered.ref,
        }
        : {
            ...registered,
            onBlur: handleBlur,
        };
    return (_jsxs("label", { className: toClassName(cn), ...dataTooltip, children: [prefix && _jsx("span", { className: "label", title: `${prefix}`, children: prefix }), _jsx("input", { ...inputProps, type: props.type === "number" ? "text" : props.type, inputMode: props.type === "number" ? "decimal" : undefined, readOnly: props.disabled, className: "field-input", autoComplete: props.autoComplete, onFocus: () => focused.current = true }), props.suffix && _jsx("span", { className: "label", children: props.suffix })] }));
}
export default InputCommon;
//# sourceMappingURL=InputCommon.js.map