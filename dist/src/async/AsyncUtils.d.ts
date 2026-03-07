import type { AsyncState } from "./useAsyncState.tsx";
export declare function formatTimeDiff(diff: number): string;
export declare function Loading(): any;
export declare function statsOnFinish<T, P>(state: AsyncState<T, P>, children: any): any;
export declare function delay(ms: number): Promise<unknown>;
