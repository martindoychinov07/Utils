import type { AsyncState } from "./useAsyncState";
export declare function formatTimeDiff(diff: number): string;
export declare function Loading(): import("react/jsx-runtime").JSX.Element;
export declare function statsOnFinish<T, P>(state: AsyncState<T, P>, children: any): import("react/jsx-runtime").JSX.Element;
export declare function delay(ms: number): Promise<unknown>;
