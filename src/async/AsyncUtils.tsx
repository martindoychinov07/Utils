import {StopWatch} from "../StopWatch.tsx";
import type {AsyncState} from "./useAsyncState.tsx";

export function formatTimeDiff(diff: number) {
  const S = Math.floor(diff / 100) % 10;
  diff = Math.floor(diff / 1000);
  const s = diff % 60;
  diff = Math.floor( diff / 60);
  const m = diff;
  return (m ? `${m.toString().padStart(2, " ")}m ` : "")
      + `${s.toString().padStart(2, " ")}.${S}s`;
}

export function Loading() {
  return <div>Loading... <StopWatch /></div>
}

export function statsOnFinish<T, P>(state: AsyncState<T, P>, children: any) {
  let text = "";
  if (state.started && state.finished) {
    text = text + ` fetch in ${formatTimeDiff(state.finished - state.started)}`;
  }
  if (state.finished) {
    text = text + ` updated on ${new Date(state.finished).toLocaleString()}`;
  }

  return <div title={text}>{children}</div>
}

export async function delay(ms: number){
  let timeout: number | undefined;
  return new Promise(
      (r) => { timeout = setTimeout(r, ms); }
  ).finally(
      () => clearTimeout(timeout)
  );
}