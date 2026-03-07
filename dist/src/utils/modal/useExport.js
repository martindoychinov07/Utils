import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useI18n } from "../../context/i18n/useI18n";
import useModal from "./useModal";
import { useEffect, useMemo } from "react";
const STORAGE_KEY = "csv";
export function useExport() {
    const { t } = useI18n();
    const Content = (props) => {
        useEffect(() => {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved)
                return;
            const values = JSON.parse(saved);
            Object.entries(values).forEach(([name, value]) => {
                const input = document.querySelector(`[name="${name}"]`);
                if (input)
                    input.value = value;
            });
        });
        const actions = _jsxs(_Fragment, { children: [_jsx("button", { className: "w-full btn btn-sm btn-primary mt-4", name: "action", value: "no", children: t("~confirm.no") }, "no"), _jsx("button", { className: "w-full btn btn-sm btn-primary mt-4", name: "action", value: "yes", children: t("~confirm.yes") }, "yes")] });
        return _jsx("form", { method: "dialog", onSubmit: (e) => {
                const submitter = e.nativeEvent.submitter;
                const action = submitter?.value;
                const formData = new FormData(e.currentTarget);
                const values = Object.fromEntries(formData.entries());
                localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
                props.close?.({ resolve: { action: action, result: { confirmed: action === "yes", ...values } } });
            }, children: _jsxs("div", { className: "grid grid-cols-2 gap-1 p-1 min-w-[20em]", children: [_jsxs("details", { className: "collapse col-span-2", children: [_jsxs("summary", { className: "collapse-title text-center", children: [t("~setting.title"), " ..."] }), _jsxs("div", { className: "collapse-content grid grid-cols-2 gap-1 p-1", children: [_jsx("label", { children: "BOM" }), _jsxs("select", { name: "bom", className: "select select-sm", children: [_jsx("option", { value: "" }), _jsx("option", { value: "\uFEFF", children: "BOM" })] }), _jsx("label", { children: "SEP" }), _jsxs("select", { name: "sep", className: "select select-sm", children: [_jsx("option", { value: " ", children: "Space" }), _jsx("option", { value: "\t", children: "Tab" }), _jsx("option", { value: ",", children: "Comma" }), _jsx("option", { value: ";", children: "Semicolon" }), _jsx("option", { value: "|", children: "Pipe" })] }), _jsx("label", { children: "EOL" }), _jsxs("select", { name: "eol", className: "select select-sm", children: [_jsx("option", { value: "\r", children: "CR" }), _jsx("option", { value: "\n", children: "LF" }), _jsx("option", { value: "\r\n", children: "CRLF" })] })] })] }), actions] }) }, "form");
    };
    const modalProps = useMemo(() => ({
        header: (props) => {
            return _jsx(_Fragment, { children: props.args?.title ?? t("~confirm.title") });
        },
        children: (props) => {
            return _jsx(Content, { close: props.close, ...props });
        },
    }), []);
    return useModal(modalProps);
}
//# sourceMappingURL=useExport.js.map