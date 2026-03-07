import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useI18n } from "../../context/i18n/useI18n.tsx";
import useModal from "./useModal.tsx";
export function useConfirm() {
    const { t } = useI18n();
    const Content = (props) => {
        var _a, _b, _c, _d;
        let actions = _jsx(_Fragment, {});
        if (((_a = props.args) === null || _a === void 0 ? void 0 : _a.buttons) === undefined || ((_b = props.args) === null || _b === void 0 ? void 0 : _b.buttons) === "no_yes") {
            actions = _jsxs(_Fragment, { children: [_jsx("button", { className: "w-full btn btn-sm btn-primary mt-4", name: "action", value: "no", children: t("~confirm.no") }, "no"), _jsx("button", { className: "w-full btn btn-sm btn-primary mt-4", name: "action", value: "yes", children: t("~confirm.yes") }, "yes")] });
        }
        else if (((_c = props.args) === null || _c === void 0 ? void 0 : _c.buttons) === "ok") {
            actions = _jsxs(_Fragment, { children: [_jsx("span", {}, "_"), _jsx("button", { className: "w-full btn btn-sm btn-primary mt-4", name: "action", value: "yes", children: t("~confirm.ok") }, "yes")] });
        }
        return _jsx("form", { method: "dialog", onSubmit: (e) => {
                var _a;
                const submitter = e.nativeEvent.submitter;
                const action = submitter === null || submitter === void 0 ? void 0 : submitter.value;
                (_a = props.close) === null || _a === void 0 ? void 0 : _a.call(props, { resolve: { action: action, result: { confirmed: action === "yes" } } });
            }, children: _jsxs("div", { className: "grid grid-cols-2 gap-1 p-1 min-w-[20em]", children: [_jsx("div", { className: "col-span-2", children: (_d = props.args) === null || _d === void 0 ? void 0 : _d.content }, "content"), actions] }) }, "form");
    };
    const modalProps = //useMemo( () => (
     {
        header: (props) => {
            var _a, _b;
            return _jsx(_Fragment, { children: (_b = (_a = props.args) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : t("~confirm.title") });
        },
        children: (props) => {
            return _jsx(Content, { close: props.close, ...props });
        },
    };
    //), []);
    return useModal(modalProps);
}
//# sourceMappingURL=useConfirm.js.map