import { useEffect, useMemo, useState } from "react";
export function useAsyncState(fn, initArgs) {
    const [args, reload] = useState(initArgs);
    const [started, setStarted] = useState();
    const [finished, setFinished] = useState(initArgs ? undefined : new Date().getTime());
    const [error, setError] = useState();
    const [result, update] = useState();
    useEffect(() => {
        let cancel = false;
        if (args) {
            setStarted(new Date().getTime());
            setFinished(undefined);
            setError(undefined);
            fn(args).then(res => {
                if (cancel)
                    return;
                update(res);
                setError(undefined);
                setFinished(new Date().getTime());
            }, error => {
                if (cancel)
                    return;
                update(undefined);
                setError(error);
                setFinished(new Date().getTime());
            });
        }
        return () => {
            cancel = true;
        };
    }, [fn, args]);
    // console.log({reload, update, args, started, finished, result, error})
    return useMemo(() => {
        return { reload, update, args, started, finished, result, error };
    }, [finished, args, result]);
}
//# sourceMappingURL=useAsyncState.js.map