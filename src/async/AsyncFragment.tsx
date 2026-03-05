import type {ReactNode} from "react";

import type {AsyncState} from "./useAsyncState.tsx";
import {Loading} from "../Loading.tsx";

export function AsyncFragment<T, P>(props: {
  asyncState?: AsyncState<T, P>,
  onFallback?: (args: P | undefined, children: ReactNode) => ReactNode,
  onError?: (error: Error, children: ReactNode) => ReactNode,
  onFinish?: (state: AsyncState<T, P>, children: ReactNode) => ReactNode,
  children: ReactNode
}) {
  if (!props.asyncState) {
    if (props.onFinish) {
      return props.onFinish({} as AsyncState<T, P>, props.children);
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

  return <>{props.children}<Loading /></>;
}