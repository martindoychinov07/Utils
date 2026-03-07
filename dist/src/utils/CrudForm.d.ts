import { type ReactNode } from "react";
import type { CrudFormModel, ListMetadata } from "./CrudFormModel.ts";
import type { ModalComponentProps } from "./modal/Modal";
import type { SelectionType } from "./modal/useModal";
export interface ListFormProps<F extends ListMetadata & SelectionType, D> {
    model: CrudFormModel<F, D>;
}
interface CrudModalFormProps<F extends ListMetadata & SelectionType, D> extends ModalComponentProps<D[], F> {
    rowClassName?: (entry?: D, index?: (number | undefined)) => (string | undefined);
    model: CrudFormModel<F, D>;
    onAction?: (action: string, payload?: D[], path?: string) => Promise<string | undefined>;
    children?: ReactNode;
}
declare function CrudForm<F extends ListMetadata & SelectionType, D>(props: CrudModalFormProps<F, D>): import("react/jsx-runtime").JSX.Element;
export default CrudForm;
