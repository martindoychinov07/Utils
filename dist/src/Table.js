import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../context/i18n/useI18n.tsx";
import * as React from "react";
const widthN = /\d+$/;
export function Table(props) {
    var _a, _b, _c, _d;
    const { t } = useI18n();
    const tableRef = useRef(null);
    const items = useMemo(() => { var _a, _b; return (_b = (_a = props.layout.items) === null || _a === void 0 ? void 0 : _a.filter(item => item.mode !== "hidden")) !== null && _b !== void 0 ? _b : []; }, [props.layout.items]);
    const [widths, setWidths] = useState([]);
    useEffect(() => {
        const newWidths = (items === null || items === void 0 ? void 0 : items.map(item => {
            var _a, _b;
            let width = parseInt((_a = localStorage.getItem(`${props.context}${item.name}.width`)) !== null && _a !== void 0 ? _a : "");
            if (!isFinite(width)) {
                if (item.size !== undefined) {
                    width = parseInt((_b = item.size) !== null && _b !== void 0 ? _b : "") * 11;
                }
                if (!isFinite(width)) {
                    width = 100;
                }
            }
            return width;
        })) || [];
        setWidths(newWidths);
    }, [items, props.context]);
    useEffect(() => {
        items === null || items === void 0 ? void 0 : items.forEach((item, index) => {
            var _a;
            if ((widths === null || widths === void 0 ? void 0 : widths[index]) !== undefined) {
                localStorage.setItem(`${props.context}${item.name}.width`, `${(_a = widths === null || widths === void 0 ? void 0 : widths[index]) !== null && _a !== void 0 ? _a : undefined}`);
            }
        });
    }, [items, props.context, widths]);
    const startResize = useCallback((index, e) => {
        var _a;
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = (_a = widths === null || widths === void 0 ? void 0 : widths[index]) !== null && _a !== void 0 ? _a : 0;
        const onMouseMove = (e) => {
            const newWidth = Math.max(startWidth + e.clientX - startX, 0); // min width
            setWidths((cols) => {
                const newCols = [...cols !== null && cols !== void 0 ? cols : []];
                newCols[index] = newWidth;
                return newCols;
            });
        };
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }, [widths]);
    const pagerPrev = (_a = props.pager) === null || _a === void 0 ? void 0 : _a.call(props, "prev");
    const pagerNext = (_b = props.pager) === null || _b === void 0 ? void 0 : _b.call(props, "next");
    if (!widths.length)
        return;
    return ( /* w-max */_jsxs("table", { className: "table", ref: (el) => { var _a; tableRef.current = el; (_a = props.onTableRef) === null || _a === void 0 ? void 0 : _a.call(props, el); }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "text-center selector", children: (_c = props.selector) === null || _c === void 0 ? void 0 : _c.call(props, props.data) }, "_"), items === null || items === void 0 ? void 0 : items.map((item, index) => {
                            var _a;
                            const width = (widths === null || widths === void 0 ? void 0 : widths[index]) ? `${widths === null || widths === void 0 ? void 0 : widths[index]}px` : "100px";
                            return (_jsxs("th", { className: `${(item.type === "hidden" || item.mode === "hidden") ? "hidden" : ""}`, style: { width: `${width}`, minWidth: `${width}` }, children: [_jsx("div", { className: "cursor-pointer", onClick: (e) => {
                                            var _a;
                                            (_a = props.onSort) === null || _a === void 0 ? void 0 : _a.call(props, item.name);
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }, children: t(item.label) }), _jsx("div", { className: "resize-handle", onMouseDown: (e) => startResize(index, e) })] }, (_a = item.name) !== null && _a !== void 0 ? _a : index));
                        })] }, "0") }, "thead"), _jsxs("tbody", { children: [pagerPrev && _jsx("tr", { children: _jsx("th", { colSpan: items === null || items === void 0 ? void 0 : items.length, children: pagerPrev }, "prev") }, "row-1"), props.data.map((entry, row) => {
                        var _a, _b;
                        const rawKey = entry[props.dataKey];
                        const key = typeof rawKey === "string" && rawKey.trim() !== "" ? rawKey : `row_${row}`;
                        return _jsxs("tr", { className: (_a = props.rowClassName) === null || _a === void 0 ? void 0 : _a.call(props, entry, row), onClick: (e) => {
                                var _a, _b;
                                const checkbox = !e.shiftKey && e.target.classList.contains("checkbox");
                                (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props, props.data, row, e.ctrlKey || checkbox, e.shiftKey);
                                if (e.shiftKey) {
                                    (_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.removeAllRanges();
                                }
                            }, onDoubleClick: () => { var _a; return (_a = props.onDoubleClick) === null || _a === void 0 ? void 0 : _a.call(props, entry, row); }, children: [_jsx("td", { className: "text-center selector", children: (_b = props.selector) === null || _b === void 0 ? void 0 : _b.call(props, props.data, row) }, "_"), (props.children !== null) && (items === null || items === void 0 ? void 0 : items.map((item, index) => {
                                    var _a, _b;
                                    return _jsx("td", { className: (item.type === "hidden" || item.mode === "hidden") ? "hidden" : undefined, children: typeof props.children === "function"
                                            ? props.children({ entry: entry, formatter: props.formatters[(_a = item.type) !== null && _a !== void 0 ? _a : "none"], item: item, index: row })
                                            : props.children }, (_b = item.name) !== null && _b !== void 0 ? _b : index);
                                }))] }, key);
                    }), pagerNext && _jsxs("tr", { children: [_jsx("td", { className: "text-center selector", children: (_d = props.selector) === null || _d === void 0 ? void 0 : _d.call(props, props.data) }, "next-selector"), _jsx("td", { colSpan: (items === null || items === void 0 ? void 0 : items.length) - 1, children: pagerNext }, "next")] }, "row+1")] }, "tbody")] }, "table"));
}
//# sourceMappingURL=Table.js.map