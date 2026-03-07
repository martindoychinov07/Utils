import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, Outlet } from "react-router-dom";
import { useI18n } from "../context/i18n/useI18n.tsx";
export function VerticalLayout(props) {
    var _a;
    const { t } = useI18n();
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsx("header", { className: "flex justify-between bg-base-200 text-black p-0", children: (_a = props.menu) === null || _a === void 0 ? void 0 : _a.map((submenu, index) => _jsx("ul", { className: "menu menu-horizontal p-1", children: submenu.map((item, subIndex) => {
                        if (item.key === "home") {
                            return _jsx("li", { className: "m-1", children: _jsx(NavLink, { to: { pathname: item.link }, children: _jsx("div", { className: "tooltip tooltip-bottom", "data-tip": t("~home.tooltip"), children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-5 h-[1.5em]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }) }) }) }) }, subIndex);
                        }
                        return (_jsx("li", { children: _jsx(NavLink, { to: { pathname: item.link }, className: ({ isActive }) => isActive ? "menu-active m-1" : "m-1", children: item.label }) }, subIndex));
                    }) }, index)) }), _jsx("main", { className: "flex-1 flex flex-col overflow-hidden bg-gray-100 p-0", children: _jsx(Outlet, {}) }), _jsx("footer", { className: "bg-gray-800 text-white p-2", children: props.footer })] }));
}
//# sourceMappingURL=VerticalLayout.js.map