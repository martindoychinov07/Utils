import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../context/i18n/useI18n";
const widthN = /\d+$/;
export function Table(props) {
    const { t } = useI18n();
    const tableRef = useRef(null);
    const items = useMemo(() => props.layout.items?.filter(item => item.mode !== "hidden") ?? [], [props.layout.items]);
    const [widths, setWidths] = useState([]);
    useEffect(() => {
        const newWidths = items?.map(item => {
            let width = parseInt(localStorage.getItem(`${props.context}${item.name}.width`) ?? "");
            if (!isFinite(width)) {
                if (item.size !== undefined) {
                    width = parseInt(item.size ?? "") * 11;
                }
                if (!isFinite(width)) {
                    width = 100;
                }
            }
            return width;
        }) || [];
        setWidths(newWidths);
    }, [items, props.context]);
    useEffect(() => {
        items?.forEach((item, index) => {
            if (widths?.[index] !== undefined) {
                localStorage.setItem(`${props.context}${item.name}.width`, `${widths?.[index] ?? undefined}`);
            }
        });
    }, [items, props.context, widths]);
    const startResize = useCallback((index, e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = widths?.[index] ?? 0;
        const onMouseMove = (e) => {
            const newWidth = Math.max(startWidth + e.clientX - startX, 0); // min width
            setWidths((cols) => {
                const newCols = [...cols ?? []];
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
    const pagerPrev = props.pager?.("prev");
    const pagerNext = props.pager?.("next");
    if (!widths.length)
        return;
    return ( /* w-max */_jsxs("table", { className: "table", ref: (el) => { tableRef.current = el; props.onTableRef?.(el); }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "text-center selector", children: props.selector?.(props.data) }, "_"), items?.map((item, index) => {
                            const width = widths?.[index] ? `${widths?.[index]}px` : "100px";
                            return (_jsxs("th", { className: `${(item.type === "hidden" || item.mode === "hidden") ? "hidden" : ""}`, style: { width: `${width}`, minWidth: `${width}` }, children: [_jsx("div", { className: "cursor-pointer", onClick: (e) => {
                                            props.onSort?.(item.name);
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }, children: t(item.label) }), _jsx("div", { className: "resize-handle", onMouseDown: (e) => startResize(index, e) })] }, item.name ?? index));
                        })] }, "0") }, "thead"), _jsxs("tbody", { children: [pagerPrev && _jsx("tr", { children: _jsx("th", { colSpan: items?.length, children: pagerPrev }, "prev") }, "row-1"), props.data.map((entry, row) => {
                        const rawKey = entry[props.dataKey];
                        const key = typeof rawKey === "string" && rawKey.trim() !== "" ? rawKey : `row_${row}`;
                        return _jsxs("tr", { className: props.rowClassName?.(entry, row), onClick: (e) => {
                                const checkbox = !e.shiftKey && e.target.classList.contains("checkbox");
                                props.onClick?.(props.data, row, e.ctrlKey || checkbox, e.shiftKey);
                                if (e.shiftKey) {
                                    window.getSelection()?.removeAllRanges();
                                }
                            }, onDoubleClick: () => props.onDoubleClick?.(entry, row), children: [_jsx("td", { className: "text-center selector", children: props.selector?.(props.data, row) }, "_"), (props.children !== null) && items?.map((item, index) => _jsx("td", { className: (item.type === "hidden" || item.mode === "hidden") ? "hidden" : undefined, children: typeof props.children === "function"
                                        ? props.children({ entry: entry, formatter: props.formatters[item.type ?? "none"], item: item, index: row })
                                        : props.children }, item.name ?? index))] }, key);
                    }), pagerNext && _jsxs("tr", { children: [_jsx("td", { className: "text-center selector", children: props.selector?.(props.data) }, "next-selector"), _jsx("td", { colSpan: items?.length - 1, children: pagerNext }, "next")] }, "row+1")] }, "tbody")] }, "table"));
}
//# sourceMappingURL=Table.js.map