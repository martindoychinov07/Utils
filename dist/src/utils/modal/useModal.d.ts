import { type ModalProps, type ModalResolve } from "./Modal";
import { type ReactElement } from "react";
export type SelectionType = {
    selection?: "one" | "many";
};
type SelectAction<R, P> = (options?: P) => Promise<ModalResolve<R, P>>;
interface ModalInput<R, P> {
    component: ReactElement;
    value: SelectAction<R, P>;
}
declare function useModal<R, P>(props: ModalProps<R, P>): ModalInput<R, P>;
export default useModal;
