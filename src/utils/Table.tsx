import type {LayoutModel, LayoutModelItem} from "./LayoutModel";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import type {InputFormatter} from "./Input";
import {useI18n} from "../context/i18n/useI18n";
import * as React from "react";

export type TableComponent<T> = (props: {entry: T, formatter: InputFormatter, item: LayoutModelItem<T>, index: number}) => ReactNode;
type TableElement<T> = ReactNode | TableComponent<T>;

interface TableParams<T> {
  context: string,
  data: T[];
  dataKey: keyof T;
  formatters: { [p: string]: InputFormatter };
  layout: LayoutModel<T>;
  children: TableElement<T> | null;
  onSort?: (name?: keyof T | string) => void;
  pager?: (position: "prev" | "next") => ReactNode;
  selector?: (entry?: T[], index?: number | undefined) => ReactNode;
  rowClassName?: (entry?: T, index?: number | undefined) => string | undefined;
  onClick?: (data?: T[], index?: number | undefined, ctrlKey?: boolean, shiftKey?: boolean) => void;
  onDoubleClick?: (entry?: T, index?: number | undefined) => void;
  onTableRef?: (el: HTMLTableElement | null) => void;
}

export interface TableHandle {
  exportCsv: () => void;
}

const widthN = /\d+$/;

export function Table<T>(props: TableParams<T>) {
  const { t } = useI18n();
  const tableRef = useRef<HTMLTableElement>(null);

  const items = useMemo(
    () => props.layout.items?.filter(item => item.mode !== "hidden") ?? [],
    [props.layout.items]
  );

  const [widths, setWidths] = useState<number[]>([]);

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

  const startResize = useCallback((index: number, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = widths?.[index] ?? 0;

    const onMouseMove = (e: MouseEvent) => {
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

  if (!widths.length) return;

  return ( /* w-max */
    <table key={"table"} className="table" ref={(el) => { tableRef.current = el; props.onTableRef?.(el) }}>
      <thead key={"thead"}>
        <tr key={"0"}>
          <th key={"_"} className={"text-center selector"}>
            {props.selector?.(props.data)}
          </th>
          {items?.map((item, index) => {
            const width = widths?.[index] ? `${widths?.[index]}px` : "100px";
            return (
            <th
              key={item.name ?? index}
              className={`${(item.type === "hidden" || item.mode === "hidden") ? "hidden" : ""}`}
              style={{ width: `${width}`, minWidth: `${width}` }}
            /*th*/>
              <div className={"cursor-pointer"} onClick={(e) => {
                props.onSort?.(item.name);
                e.preventDefault();
                e.stopPropagation() }}>{t(item.label)}
              </div>
              <div
                className="resize-handle"
                onMouseDown={(e) => startResize(index, e)}
              ></div>
            </th>)})
          }
        </tr>
      </thead>
      <tbody key={"tbody"}>
      {pagerPrev && <tr key={"row-1"}><th key={"prev"} colSpan={items?.length}>{pagerPrev}</th></tr>}
      {props.data.map((entry, row) => {
        const rawKey = entry[props.dataKey];
        const key= typeof rawKey === "string" && rawKey.trim() !== "" ? rawKey : `row_${row}`;
        return <tr
          key={key}
          className={props.rowClassName?.(entry, row)}
          onClick={(e) => {
            const checkbox = !e.shiftKey && (e.target as HTMLElement).classList.contains("checkbox");
            props.onClick?.(props.data, row, e.ctrlKey || checkbox, e.shiftKey);
            if (e.shiftKey) {
              window.getSelection()?.removeAllRanges();
            }
          }}
          onDoubleClick={() => props.onDoubleClick?.(entry, row)}
        /*tr*/>
          <td key={"_"} className={"text-center selector"}>
            {props.selector?.(props.data, row)}
          </td>
          {(props.children !== null) && items?.map((item, index) =>
            <td key={item.name ?? index} className={(item.type === "hidden" || item.mode === "hidden") ? "hidden" : undefined}>
              {
                typeof props.children === "function"
                ? props.children({ entry: entry, formatter: props.formatters[item.type ?? "none"], item: item, index: row })
                : props.children
              }
            </td>)
          }
        </tr>
      })}
      {pagerNext && <tr key={"row+1"}>
          <td key={"next-selector"} className={"text-center selector"}>{props.selector?.(props.data)}</td>
          <td key={"next"} colSpan={items?.length - 1}>{pagerNext}</td>
        </tr>}
      </tbody>
    </table>
  )
}