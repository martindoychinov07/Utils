import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
export function Modal(props) {
    const dialogRef = useRef(null);
    const cancel = useRef(undefined);
    const args = useRef(undefined);
    const result = useRef(undefined);
    cancel.current = undefined;
    result.current = undefined;
    const handleClose = ({ resolve, reject }) => {
        args.current = resolve?.args;
        result.current = resolve?.result;
        cancel.current = reject;
        dialogRef.current?.close(reject ?? resolve?.action ?? dialogRef.current?.returnValue);
    };
    useEffect(() => {
        if (props.open) {
            dialogRef.current?.showModal();
        }
    }, [props.open]);
    const body = typeof props.children === "function"
        ? props.children({ open: props.open, close: handleClose, args: props.args })
        : props.children;
    return _jsxs("dialog", { ref: dialogRef, className: "modal", onCancel: (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose({ resolve: {}, reject: "esc" });
        }, onClose: () => {
            if (cancel.current || result.current) {
                props.onClose?.({
                    resolve: { args: args.current, action: cancel.current ?? dialogRef.current?.returnValue, result: result.current },
                    reject: cancel.current
                });
            }
        }, children: [_jsxs("div", { className: `modal-box w-fit resize max-h-[calc(100%-1em)] max-w-[calc(100%-1em)] flex-1 flex flex-col overflow-hidden ${props.variant === "full" ? "min-h-[calc(100%-1em)] min-w-[calc(100%-1em)]" : ""}`, children: [_jsx("div", { className: "font-bold text-lg grid gap-1 p-1", children: typeof props.header === "function" ? props.header({ close: handleClose, args: props.args }) : props.header }, "dialog_header"), props.noWrapper
                        ? body
                        : _jsx("div", { className: "py-0 flex-1 overflow-y-auto", children: body }, "dialog_body"), props.footer && _jsx("div", { className: "modal-action grid gap-1 p-1", children: typeof props.footer === "function" ? props.footer({ close: handleClose, args: props.args }) : props.footer }, "dialog_footer"), _jsx("form", { method: "dialog", children: _jsx("button", { formMethod: "dialog", className: "btn btn-sm btn-circle btn-ghost absolute right-2 top-2", onClick: () => cancel.current = "x", children: "\u2715" }) }, "dialog_close")] }, "dialog_container"), _jsx("form", { method: "dialog", className: "modal-backdrop", onSubmit: () => cancel.current = "out", children: _jsx("button", { formMethod: "dialog", children: "close" }) }, "dialog_backdrop")] }, "dialog");
}
//# sourceMappingURL=Modal.js.map