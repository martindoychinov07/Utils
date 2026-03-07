import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useI18n } from "../../context/i18n/useI18n";
import useModal from "./useModal";
import { Calendar } from "../Calendar";
export function useCalendar() {
    const { t } = useI18n();
    const Content = (props) => {
        return (_jsx("form", { method: "dialog", onSubmit: (e) => {
                const submitter = e.nativeEvent.submitter;
                const action = submitter?.value;
                const date = new Date(action);
                if (date) {
                    props.close?.({ resolve: { action: "select", result: { date } } });
                }
                else {
                    props.close?.({
                        resolve: { action: "select", result: { date: undefined } },
                        reject: "code",
                    });
                }
            }, children: _jsx("div", { className: "grid grid-cols-2 gap-1 p-1 min-w-[20em]", children: _jsx("div", { className: "col-span-2", children: _jsx(Calendar, { date: props.args?.date }) }, "content") }) }, "form"));
    };
    const modalProps = {
        header: (props) => _jsx(_Fragment, { children: props.args?.title ?? t("~calendar.title") }),
        children: (props) => _jsx(Content, { close: props.close, ...props }),
    };
    return useModal(modalProps);
}
//# sourceMappingURL=useCalendar.js.map