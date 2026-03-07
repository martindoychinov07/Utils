import type { ReactNode } from "react";
import type { AsyncState } from "./useAsyncState";
export declare function AsyncFragment<T, P>(props: {
    asyncState?: AsyncState<T, P>;
    onFallback?: (args: P | undefined, children: ReactNode) => ReactNode;
    onError?: (error: Error, children: ReactNode) => ReactNode;
    onFinish?: (state: AsyncState<T, P>, children: ReactNode) => ReactNode;
    children: ReactNode;
}): string | number | bigint | boolean | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode>> | import("react/jsx-runtime").JSX.Element;
