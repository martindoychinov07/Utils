import type { ReactNode } from "react";
import type { AsyncState } from "./useAsyncState.tsx";
export declare function AsyncFragment<T, P>(props: {
    asyncState?: AsyncState<T, P>;
    onFallback?: (args: P | undefined, children: ReactNode) => ReactNode;
    onError?: (error: Error, children: ReactNode) => ReactNode;
    onFinish?: (state: AsyncState<T, P>, children: ReactNode) => ReactNode;
    children: ReactNode;
}): any;
