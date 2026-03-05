import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from "react";

export interface AsyncState<T, P> {
  reload: Dispatch<SetStateAction<P | undefined>>;
  update: Dispatch<SetStateAction<T | undefined>>;
  args: P | undefined;
  started?: number;
  finished?: number;
  result: T | undefined;
  error: Error | undefined
}

export function useAsyncState<T, P>(fn: (args: P) => Promise<T>, initArgs?: P | (() => P)): AsyncState<T, P> {
  const [args, reload] = useState<P | undefined>(initArgs);
  const [started, setStarted] = useState<number | undefined>();
  const [finished, setFinished] = useState<number | undefined>( initArgs ? undefined : new Date().getTime());
  const [error, setError] = useState<Error | undefined>();
  const [result, update] = useState<T | undefined>();
  useEffect(() => {
    let cancel = false;
    if (args) {
      setStarted(new Date().getTime());
      setFinished(undefined);
      setError(undefined);
      fn(args).then(
        res => {
          if (cancel) return;
          update(res)
          setError(undefined);
          setFinished(new Date().getTime());
        },
        error => {
          if (cancel) return;
          update(undefined)
          setError(error);
          setFinished(new Date().getTime());
        }
      );
    }
    return () => {
      cancel = true;
    }
  }, [fn, args])
  // console.log({reload, update, args, started, finished, result, error})
  return useMemo(
    () => {
      return { reload, update, args, started, finished, result, error };
    },
    [finished, args, result]
  );
}