import { type UseFormReturn } from "react-hook-form";
import { type HTMLInputAutoCompleteAttribute, type HTMLInputTypeAttribute, type ReactNode } from "react";
import type { ItemRules } from "./LayoutModel.ts";
export type InputFormatter = (value: string, format?: string | null | undefined, normalize?: boolean) => string | null | undefined;
export type InputOption = {
    label: string;
    value?: string | number;
    disabled?: boolean;
};
export type InputOptions<T> = (entry?: T | unknown) => InputOption[] | Promise<InputOption[]>;
export interface InputProps<T extends object> {
    form: UseFormReturn;
    type: HTMLInputTypeAttribute | "select" | undefined;
    name: string;
    prefix?: ReactNode;
    suffix?: ReactNode;
    placeholder?: string;
    variant?: "bordered" | "ghost" | "label" | "compact" | "title";
    autoComplete?: HTMLInputAutoCompleteAttribute;
    formatter?: InputFormatter;
    format?: string | null;
    entry?: T;
    options?: InputOptions<T>;
    action?: string;
    rules?: ItemRules;
    disabled?: boolean;
}
export interface ClassNameRule {
    addIf: boolean;
    add: string;
    orElse?: string;
}
export declare function Input<T extends object>(props: InputProps<T>): any;
