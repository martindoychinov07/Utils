import { type DependencyList } from "react";
import type { KeyCode } from "./KeyCode";
export type FocusableField = HTMLInputElement | HTMLSelectElement;
export interface FocusContext {
    current: FocusableField;
    key: KeyCode;
    event: KeyboardEvent;
}
export type NextFocus = (ctx: FocusContext) => void;
export declare function useKeyboardNavigation(nextFocus: NextFocus, deps: DependencyList): void;
