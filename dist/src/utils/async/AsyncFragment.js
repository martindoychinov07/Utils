import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Loading } from "../Loading";
export function AsyncFragment(props) {
    if (!props.asyncState) {
        if (props.onFinish) {
            return props.onFinish({}, props.children);
        }
        return props.children;
    }
    if (props.asyncState.error) {
        if (props.onError) {
            return props.onError(props.asyncState.error, props.children);
        }
        throw props.asyncState.error;
    }
    if (props.asyncState.finished) {
        if (props.onFinish) {
            return props.onFinish(props.asyncState, props.children);
        }
        return props.children;
    }
    if (props.onFallback) {
        return props.onFallback(props.asyncState.args, props.children);
    }
    return _jsxs(_Fragment, { children: [props.children, _jsx(Loading, {})] });
}
//# sourceMappingURL=AsyncFragment.js.map