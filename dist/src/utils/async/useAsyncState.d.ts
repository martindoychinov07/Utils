import { type Dispatch, type SetStateAction } from "react";
export interface AsyncState<T, P> {
    reload: Dispatch<SetStateAction<P | undefined>>;
    update: Dispatch<SetStateAction<T | undefined>>;
    args: P | undefined;
    started?: number;
    finished?: number;
    result: T | undefined;
    error: Error | undefined;
}
export declare function useAsyncState<T, P>(fn: (args: P) => Promise<T>, initArgs?: P | (() => P)): AsyncState<T, P>;
