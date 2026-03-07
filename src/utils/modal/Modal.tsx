import { type ReactNode, useEffect, useRef } from "react";

export type ModalReject = "code" | "esc" | "out" | "x";
export interface ModalResolve<R, P> {
  args?: P;
  action?: string;
  result?: R;
}
export type ModalCloseEvent<R, P> = (modal: { resolve: ModalResolve<R, P>, reject?: ModalReject }) => void;
export type ModalComponentProps<R, P> = {open?: boolean, close?: ModalCloseEvent<R, P>, args?: P};
export type ModalComponent<R, P> = (props: ModalComponentProps<R, P>) => ReactNode;
type ModalElement<R, P> = ReactNode | ModalComponent<R, P>;

export interface ModalProps<R, P> {
  open?: boolean | undefined;
  args?: P,
  header?: ModalElement<R, P>,
  children: ModalElement<R, P>,
  footer?: ModalElement<R, P>,
  onClose?: ModalCloseEvent<R, P>,
  noWrapper?: boolean,
  variant?: "full",
}

export function Modal<R, P>(props: ModalProps<R, P>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancel = useRef<ModalReject>(undefined);
  const args = useRef<P>(undefined);
  const result = useRef<R>(undefined);

  cancel.current = undefined;
  result.current = undefined;

  const handleClose: ModalCloseEvent<R, P> = ({ resolve, reject }) => {
    args.current = resolve?.args;
    result.current = resolve?.result;
    cancel.current = reject;
    dialogRef.current?.close(reject ?? resolve?.action ?? dialogRef.current?.returnValue);
  }

  useEffect(() => {
    if (props.open) {
      dialogRef.current?.showModal();
    }
  }, [props.open]);

  const body = typeof props.children === "function"
    ? props.children({ open: props.open, close: handleClose, args: props.args })
    : props.children;

  return <dialog
    key={"dialog"}
    ref={dialogRef}
    className="modal"
    onCancel={(e) => {
      e.preventDefault();
      e.stopPropagation();
      handleClose({ resolve: {}, reject: "esc" });
    }}
    onClose={() => {
      if (cancel.current || result.current) {
        props.onClose?.({
          resolve: { args: args.current, action: cancel.current ?? dialogRef.current?.returnValue, result: result.current },
          reject: cancel.current
        });
      }
    }}
  >
    <div key={"dialog_container"}
         className={`modal-box w-fit resize max-h-[calc(100%-1em)] max-w-[calc(100%-1em)] flex-1 flex flex-col overflow-hidden ${props.variant === "full" ? "min-h-[calc(100%-1em)] min-w-[calc(100%-1em)]" : ""}`}
    /*div*/>
      <div key={"dialog_header"} className="font-bold text-lg grid gap-1 p-1">
        {typeof props.header === "function" ? props.header({ close: handleClose, args: props.args }) : props.header}
      </div>
      {
        props.noWrapper
        ? body
        : <div key={"dialog_body"} className="py-0 flex-1 overflow-y-auto">{body}</div>
      }
      {props.footer && <div key={"dialog_footer"} className="modal-action grid gap-1 p-1">
        {typeof props.footer === "function" ? props.footer({ close: handleClose, args: props.args }) : props.footer}
      </div>}
      <form method="dialog" key={"dialog_close"}>
        <button formMethod="dialog" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => cancel.current = "x"}>✕</button>
      </form>
    </div>
    <form key={"dialog_backdrop"} method="dialog" className="modal-backdrop" onSubmit={() => cancel.current = "out" }>
      <button formMethod="dialog">close</button>
    </form>
  </dialog>
}