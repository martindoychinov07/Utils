import { type DependencyList, useEffect } from "react";
import type { KeyCode } from "./KeyCode";

export type FocusableField =
  | HTMLInputElement
  | HTMLSelectElement;

export interface FocusContext {
  current: FocusableField;
  key: KeyCode;
  event: KeyboardEvent;
}

export type NextFocus = (
  ctx: FocusContext
) => void;

const ARROW_KEYS: KeyCode[] = [
  "Escape",
  "Enter",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
];

function shouldNavigate(
  elem: FocusableField,
  key: KeyCode
): boolean {
  // INPUT
  if (elem instanceof HTMLInputElement) {
    const { selectionStart, selectionEnd, value } = elem;
    if (
      selectionStart === null ||
      selectionEnd === null
    ) {
      return false;
    }

    const allSelected =
      selectionStart === 0 &&
      selectionEnd === value.length;

    const atStart =
      selectionStart === 0 &&
      selectionEnd === 0;

    const atEnd =
      selectionStart === value.length &&
      selectionEnd === value.length;

    return (
      allSelected ||
        key === "Enter" ||
      (atStart &&
        (key === "ArrowLeft" || key === "ArrowUp")) ||
      (atEnd &&
        (key === "ArrowRight" || key === "ArrowDown"))
    );
  }

  // SELECT
  if (elem instanceof HTMLSelectElement) {
    // Never steal Up / Down (option navigation)
    if (key === "ArrowUp" || key === "ArrowDown") {
      return false;
    }

    // Left / Right move focus
    return key === "Enter" || key === "ArrowLeft" || key === "ArrowRight";
  }

  return false;
}


export function useKeyboardNavigation(
  nextFocus: NextFocus,
  deps: DependencyList
) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!ARROW_KEYS.includes(e.key as KeyCode)) return;

      const target = e.target;
      if (
        !(
          target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement
        )
      ) {
        return;
      }

      const key = e.key as KeyCode;

      if (!shouldNavigate(target, key)) return;

      nextFocus({
        current: target,
        key,
        event: e,
      });
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [...deps, nextFocus]);
}

