import type { LayoutModel } from "./LayoutModel";
import type { InputOptions } from "./Input";
import type { SelectionType } from "./modal/useModal";
export type PageMetadata = {
    size?: number;
    number?: number;
    totalElements?: number;
    totalPages?: number;
};
export type ListType<D> = {
    content?: D[];
    page?: PageMetadata;
};
export interface ListMetadata {
    page?: number;
    size?: number;
    sort?: string;
    direction?: "ASC" | "DESC";
    view?: string;
}
type FormAction = "default" | "search" | "create" | "copy" | "edit" | "save" | "cancel" | "remove" | "export" | "confirm" | "close";
export type FormValue<F extends ListMetadata & SelectionType, D> = {
    args: F & ListMetadata & SelectionType;
    action?: FormAction | (string & {});
    selected: string[];
    disabled: string[];
    mode?: string;
    input?: D;
    inputId: Extract<keyof D, string>;
};
export type CrudFormModel<F extends ListMetadata & SelectionType, D> = {
    action: {
        search: (args: F) => Promise<ListType<D>>;
        create?: (param: {
            requestBody: D;
        }) => Promise<D>;
        save?: (param: {
            id: number;
            requestBody: D;
        }) => Promise<D>;
        remove?: (param: {
            id: number;
        }) => Promise<void>;
    };
    form: FormValue<F, D>;
    fields: {
        layout: LayoutModel<F>;
        options: {
            [key: string]: InputOptions<F>;
        };
    };
    table: {
        layout: LayoutModel<D>;
        options: {
            [key: string]: InputOptions<D>;
        };
        defaults?: (entry?: D, action?: string) => D | Promise<D>;
    };
};
export {};
