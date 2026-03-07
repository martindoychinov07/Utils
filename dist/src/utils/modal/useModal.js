import { jsx as _jsx } from "react/jsx-runtime";
import { Modal } from "./Modal";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
const modalRoot = document.getElementById("modal-root") ?? document.body;
function useModal(props) {
    const [args, update] = useState(props.args);
    const [open, show] = useState(props.open);
    const [resolver, setResolver] = useState(null);
    const handleClose = useCallback(({ resolve, reject }) => {
        setResolver(null);
        show(undefined);
        resolver?.(reject ? { action: reject } : resolve);
        props.onClose?.({ resolve, reject });
    }, [resolver, props]);
    const value = useCallback((args) => {
        if (args !== undefined) {
            update(args);
        }
        show(true);
        return new Promise((resolve) => {
            setResolver(() => resolve);
        });
    }, []);
    const component = useMemo(() => (createPortal(_jsx(Modal, { ...props, open: open, args: args, onClose: handleClose }), modalRoot)), [props, open, args, handleClose]);
    return useMemo(() => ({ component, value }), [component, value]);
}
export default useModal;
//# sourceMappingURL=useModal.js.map