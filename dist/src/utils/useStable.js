import { useCallback, useRef } from "react";
function shallowEqual(a, b) {
    if (a === b)
        return true;
    if (!a || !b)
        return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length)
        return false;
    for (const key of keysA) {
        if (a[key] !== b[key])
            return false;
    }
    return true;
}
export function useStable() {
    const ref = useRef(undefined);
    return useCallback((next) => {
        if (!ref.current || !shallowEqual(ref.current, next)) {
            ref.current = next;
        }
        return ref.current;
    }, []);
}
//# sourceMappingURL=useStable.js.map