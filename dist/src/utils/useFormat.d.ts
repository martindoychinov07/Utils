import type { ClassNameRule, InputFormatter } from "./Input";
export declare function useFormat(): {
    [key: string]: InputFormatter;
};
export declare function toFixed(num: number, fraction: number): string;
export declare function toClassName(rules: ClassNameRule[]): string;
