var _a;
import { jsx as _jsx } from "react/jsx-runtime";
import { Modal } from "./Modal.tsx";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
const modalRoot = (_a = document.getElementById("modal-root")) !== null && _a !== void 0 ? _a : document.body;
function useModal(props) {
    const [args, update] = useState(props.args);
    const [open, show] = useState(props.open);
    const [resolver, setResolver] = useState(null);
    const handleClose = useCallback(({ resolve, reject }) => {
        var _a;
        setResolver(null);
        show(undefined);
        resolver === null || resolver === void 0 ? void 0 : resolver(reject ? { action: reject } : resolve);
        (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props, { resolve, reject });
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