import { useEffect } from "react";
const ARROW_KEYS = [
    "Escape",
    "Enter",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
];
function shouldNavigate(elem, key) {
    // INPUT
    if (elem instanceof HTMLInputElement) {
        const { selectionStart, selectionEnd, value } = elem;
        if (selectionStart === null ||
            selectionEnd === null) {
            return false;
        }
        const allSelected = selectionStart === 0 &&
            selectionEnd === value.length;
        const atStart = selectionStart === 0 &&
            selectionEnd === 0;
        const atEnd = selectionStart === value.length &&
            selectionEnd === value.length;
        return (allSelected ||
            key === "Enter" ||
            (atStart &&
                (key === "ArrowLeft" || key === "ArrowUp")) ||
            (atEnd &&
                (key === "ArrowRight" || key === "ArrowDown")));
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
export function useKeyboardNavigation(nextFocus, deps) {
    useEffect(() => {
        function onKeyDown(e) {
            if (!ARROW_KEYS.includes(e.key))
                return;
            const target = e.target;
            if (!(target instanceof HTMLInputElement ||
                target instanceof HTMLSelectElement)) {
                return;
            }
            const key = e.key;
            if (!shouldNavigate(target, key))
                return;
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
//# sourceMappingURL=useKeyboard.js.map