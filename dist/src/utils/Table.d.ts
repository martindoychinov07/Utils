import type { LayoutModel, LayoutModelItem } from "./LayoutModel";
import { type ReactNode } from "react";
import type { InputFormatter } from "./Input";
export type TableComponent<T> = (props: {
    entry: T;
    formatter: InputFormatter;
    item: LayoutModelItem<T>;
    index: number;
}) => ReactNode;
type TableElement<T> = ReactNode | TableComponent<T>;
interface TableParams<T> {
    context: string;
    data: T[];
    dataKey: keyof T;
    formatters: {
        [p: string]: InputFormatter;
    };
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
export declare function Table<T>(props: TableParams<T>): import("react/jsx-runtime").JSX.Element;
export {};
