import type { Path, ValidationRule } from "react-hook-form";
export declare const MetaLayoutVariants: readonly ["none", "left", "inner", "top", "table"];
export type MetaLayoutVariant = typeof MetaLayoutVariants[number];
export declare const MetaLayoutItemTypes: readonly ["open", "more", "hidden", "text", "number", "select", "radio", "checkbox", "dialog", "datetime", "password", "search", "button", "submit", "reset", "toggle", "confirm"];
export type MetaLayoutItemType = typeof MetaLayoutItemTypes[number];
export interface LayoutModel<T> {
    items?: LayoutModelItem<T>[];
    columns?: number;
    span?: number;
    variant?: MetaLayoutVariant | string;
}
export type ItemRules = {
    required?: boolean | string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: ValidationRule<RegExp>;
};
export interface LayoutModelItem<T> {
    group?: string;
    name?: Path<T> | string;
    label: string;
    suffix?: string;
    title?: string;
    span?: number;
    size?: string;
    type?: MetaLayoutItemType;
    format?: string;
    mode?: "disabled" | "hidden" | undefined;
    variant?: "bordered" | "ghost" | "label" | "compact" | "title";
    source?: Path<T> | string;
    enable?: string[];
    disable?: string[];
    rules?: ItemRules;
}
export interface MetaLayoutGroupItem<T> {
    value?: LayoutModelItem<T>;
    children?: LayoutModelItem<T>[];
}
export declare function layoutDivider<T>(span: number): LayoutModelItem<T>;
export declare function findEnabled<T>(items: LayoutModelItem<T>[] | undefined, currentName: string, step: number): LayoutModelItem<T> | undefined;
export declare function splitPath(path: string, n: number): string[];
