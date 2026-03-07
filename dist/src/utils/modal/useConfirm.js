import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useI18n } from "../../context/i18n/useI18n";
import useModal from "./useModal";
export function useConfirm() {
    const { t } = useI18n();
    const Content = (props) => {
        let actions = _jsx(_Fragment, {});
        if (props.args?.buttons === undefined || props.args?.buttons === "no_yes") {
            actions = _jsxs(_Fragment, { children: [_jsx("button", { className: "w-full btn btn-sm btn-primary mt-4", name: "action", value: "no", children: t("~confirm.no") }, "no"), _jsx("button", { className: "w-full btn btn-sm btn-primary mt-4", name: "action", value: "yes", children: t("~confirm.yes") }, "yes")] });
        }
        else if (props.args?.buttons === "ok") {
            actions = _jsxs(_Fragment, { children: [_jsx("span", {}, "_"), _jsx("button", { className: "w-full btn btn-sm btn-primary mt-4", name: "action", value: "yes", children: t("~confirm.ok") }, "yes")] });
        }
        return _jsx("form", { method: "dialog", onSubmit: (e) => {
                const submitter = e.nativeEvent.submitter;
                const action = submitter?.value;
                props.close?.({ resolve: { action: action, result: { confirmed: action === "yes" } } });
            }, children: _jsxs("div", { className: "grid grid-cols-2 gap-1 p-1 min-w-[20em]", children: [_jsx("div", { className: "col-span-2", children: props.args?.content }, "content"), actions] }) }, "form");
    };
    const modalProps = //useMemo( () => (
     {
        header: (props) => {
            return _jsx(_Fragment, { children: props.args?.title ?? t("~confirm.title") });
        },
        children: (props) => {
            return _jsx(Content, { close: props.close, ...props });
        },
    };
    //), []);
    return useModal(modalProps);
}
//# sourceMappingURL=useConfirm.js.map