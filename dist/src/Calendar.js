import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { generateCalendarDates } from "./DateUtils.ts";
import { useState } from "react";
import { useI18n } from "../context/i18n/useI18n.tsx";
import { range } from "./NumberUtils.ts";
export function Calendar(props) {
    var _a;
    const { t } = useI18n();
    const [date, setDate] = useState((_a = props.date) !== null && _a !== void 0 ? _a : new Date());
    const dates = generateCalendarDates(date.getFullYear(), date.getMonth() + 1, 1, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    const monthDiffChange = (monthDiff) => setDate(new Date(date.setMonth(date.getMonth() + monthDiff)));
    const monthChange = (month) => setDate(new Date(date.setMonth(month)));
    const yearChange = (year) => setDate(new Date(date.setFullYear(year)));
    const month = date.getMonth();
    const year = date.getFullYear();
    return _jsxs("div", { children: [_jsxs("div", { className: "grid grid-cols-12 gap-2 text-center p-2", children: [_jsx("div", { className: "btn btn-sm btn-ghost", onClick: () => monthDiffChange(-12), children: "-" }, "m-12"), _jsx("select", { className: "select select-sm col-span-4", onChange: (e) => yearChange(Number(e.target.value)), defaultValue: year, children: range(year - 4, year + 4).map(value => _jsx("option", { value: value, children: value }, value)) }, `year_${year}`), _jsx("div", { className: "btn btn-sm btn-ghost", onClick: () => monthDiffChange(+12), children: "+" }, "m+12"), _jsx("div", { className: "btn btn-sm btn-ghost", onClick: () => monthDiffChange(-1), children: "-" }, "m-1"), _jsx("select", { className: "select select-sm col-span-4", onChange: (e) => monthChange(Number(e.target.value)), defaultValue: month, children: range(0, 11).map(value => _jsx("option", { value: value, children: t(`~month.${value}`) }, value)) }, `month_${month}`), _jsx("div", { className: "btn btn-sm btn-ghost", onClick: () => monthDiffChange(+1), children: "+" }, "m+1")] }, "current"), _jsxs("div", { className: "grid grid-cols-7 gap-2 text-center", children: [_jsx("div", { className: "col-span-7 border-b-2" }), dates.filter((d, index) => index < 7).map((d, index) => _jsx("div", { children: t(`~dayOfWeek.${d.getDay()}`) }, `dw_${index}`)), _jsx("div", { className: "col-span-7 border-b-2" }), dates.map((d, index) => _jsx("button", { className: `btn ${d.getMonth() !== date.getMonth() ? "btn-ghost opacity-20" : d.getDate() === date.getDate() ? "btn-primary" : "btn-ghost"}`, value: d.toISOString(), children: d.getDate() }, index))] }, `dates_${year}_${month}`)] }, "calendar");
}
//# sourceMappingURL=Calendar.js.map