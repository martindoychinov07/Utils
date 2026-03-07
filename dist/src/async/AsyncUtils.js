import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StopWatch } from "../StopWatch.tsx";
export function formatTimeDiff(diff) {
    const S = Math.floor(diff / 100) % 10;
    diff = Math.floor(diff / 1000);
    const s = diff % 60;
    diff = Math.floor(diff / 60);
    const m = diff;
    return (m ? `${m.toString().padStart(2, " ")}m ` : "")
        + `${s.toString().padStart(2, " ")}.${S}s`;
}
export function Loading() {
    return _jsxs("div", { children: ["Loading... ", _jsx(StopWatch, {})] });
}
export function statsOnFinish(state, children) {
    let text = "";
    if (state.started && state.finished) {
        text = text + ` fetch in ${formatTimeDiff(state.finished - state.started)}`;
    }
    if (state.finished) {
        text = text + ` updated on ${new Date(state.finished).toLocaleString()}`;
    }
    return _jsx("div", { title: text, children: children });
}
export async function delay(ms) {
    let timeout;
    return new Promise((r) => { timeout = setTimeout(r, ms); }).finally(() => clearTimeout(timeout));
}
//# sourceMappingURL=AsyncUtils.js.map