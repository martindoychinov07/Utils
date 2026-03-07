import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useI18n } from "../../context/i18n/useI18n.tsx";
import useModal from "./useModal.tsx";
import { Calendar } from "../Calendar.tsx";
export function useCalendar() {
    const { t } = useI18n();
    const Content = (props) => {
        var _a;
        return _jsx("form", { method: "dialog", onSubmit: (e) => {
                var _a, _b;
                const submitter = e.nativeEvent.submitter;
                const action = submitter === null || submitter === void 0 ? void 0 : submitter.value;
                const date = new Date(action);
                if (date) {
                    // date.setMinutes( + new Date().getTimezoneOffset());
                    (_a = props.close) === null || _a === void 0 ? void 0 : _a.call(props, { resolve: { action: "select", result: { date: date } } });
                }
                else {
                    (_b = props.close) === null || _b === void 0 ? void 0 : _b.call(props, { resolve: { action: "select", result: { date: undefined } }, reject: "code" });
                }
            }, children: _jsx("div", { className: "grid grid-cols-2 gap-1 p-1 min-w-[20em]", children: _jsx("div", { className: "col-span-2", children: _jsx(Calendar, { date: (_a = props.args) === null || _a === void 0 ? void 0 : _a.date }) }, "content") }) }, "form");
    };
    const modalProps = //useMemo( () => (
     {
        header: (props) => {
            var _a, _b;
            return _jsx(_Fragment, { children: (_b = (_a = props.args) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : t("~calendar.title") });
        },
        children: (props) => {
            return _jsx(Content, { close: props.close, ...props });
        },
    };
    //), []);
    return useModal(modalProps);
}
//# sourceMappingURL=useCalendar.js.map