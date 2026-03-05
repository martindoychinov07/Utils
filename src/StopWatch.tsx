import {useEffect, useRef, useState} from "react";
import {formatTimeDiff} from "./async/AsyncUtils.tsx";

export function StopWatch() {
  const start = useRef(new Date().getTime());
  const [, ticking] = useState<boolean>(false);
  useEffect(() => {
    const interval = setInterval(() => ticking(tick => !tick), 100);
    return () => clearInterval(interval)
  }, []);
  const diff = new Date().getTime() - start.current;
  return <>{formatTimeDiff(diff)}</>
}