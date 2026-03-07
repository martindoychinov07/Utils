import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { formatTimeDiff } from "./async/AsyncUtils.tsx";
export function StopWatch() {
    const start = useRef(new Date().getTime());
    const [, ticking] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => ticking(tick => !tick), 100);
        return () => clearInterval(interval);
    }, []);
    const diff = new Date().getTime() - start.current;
    return _jsx(_Fragment, { children: formatTimeDiff(diff) });
}
//# sourceMappingURL=StopWatch.js.map