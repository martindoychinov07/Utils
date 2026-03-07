import { useCallback, useRef } from "react";

function shallowEqual<T extends Record<string, unknown>>(a?: T, b?: T): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  const keysA = Object.keys(a) as (keyof T)[];
  const keysB = Object.keys(b) as (keyof T)[];

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }

  return true;
}

export function useStable<T extends Record<string, unknown>>() {
  const ref = useRef<T>(undefined);

  return useCallback((next: T): T => {
    if (!ref.current || !shallowEqual(ref.current, next)) {
      ref.current = next;
    }
    return ref.current;
  }, []);
}
