import type { RefObject } from "react";
export declare function getSelection<D>(selection: "one" | "many", selected: string[], key: string | undefined, data?: D[], index?: number, ctrlKey?: boolean, shiftKey?: boolean): string[];
export declare function copyTable(ref: RefObject<HTMLTableElement | null>, fileName?: string, bom?: string, sep?: string, eol?: string): void;
