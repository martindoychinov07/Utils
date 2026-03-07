import { type InputFormatter, type InputOptions, type InputProps } from "./Input.tsx";
import type { LayoutModelItem } from "./LayoutModel.ts";
import type { Path, UseFormReturn } from "react-hook-form";
interface LayoutInputProps<T extends object> {
    form: UseFormReturn<any, any>;
    variant?: InputProps<T>["variant"];
    item: LayoutModelItem<T>;
    name?: Path<T> | string;
    index: number;
    disabled?: boolean;
    formatter?: InputFormatter;
    options?: InputOptions<T>;
}
export declare function LayoutInput<T extends object>(props: LayoutInputProps<T>): any;
export {};
