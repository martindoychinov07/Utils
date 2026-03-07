import { type ReactNode } from "react";
export type ModalReject = "code" | "esc" | "out" | "x";
export interface ModalResolve<R, P> {
    args?: P;
    action?: string;
    result?: R;
}
export type ModalCloseEvent<R, P> = (modal: {
    resolve: ModalResolve<R, P>;
    reject?: ModalReject;
}) => void;
export type ModalComponentProps<R, P> = {
    open?: boolean;
    close?: ModalCloseEvent<R, P>;
    args?: P;
};
export type ModalComponent<R, P> = (props: ModalComponentProps<R, P>) => ReactNode;
type ModalElement<R, P> = ReactNode | ModalComponent<R, P>;
export interface ModalProps<R, P> {
    open?: boolean | undefined;
    args?: P;
    header?: ModalElement<R, P>;
    children: ModalElement<R, P>;
    footer?: ModalElement<R, P>;
    onClose?: ModalCloseEvent<R, P>;
    noWrapper?: boolean;
    variant?: "full";
}
export declare function Modal<R, P>(props: ModalProps<R, P>): any;
export {};
