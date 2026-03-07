export const MetaLayoutVariants = ["none", "left", "inner", "top", "table"];
export const MetaLayoutItemTypes = ["open", "more", "hidden", "text", "number", "select", "radio", "checkbox", "dialog", "datetime", "password", "search", "button", "submit", "reset", "toggle", "confirm"];
export function layoutDivider(span) { return ({ span: span, label: "" }); }
export function findEnabled(items, currentName, step) {
    if (!items)
        return undefined;
    const index = items.findIndex(i => i.group === undefined ? i.name === currentName : `${i.group}.${i.name}` === currentName);
    if (index === -1)
        return undefined;
    for (let i = index + step; i >= 0 && i < items.length; i += step) {
        if (items[i].mode === undefined && items[i].type !== "hidden") {
            return items[i];
        }
    }
    return undefined;
}
export function splitPath(path, n) {
    const parts = path.split(".");
    const firstSegments = parts.slice(0, n);
    if (parts.length > n) {
        const remaining = parts.slice(n).join(".");
        return [...firstSegments, remaining];
    }
    return firstSegments;
}
//# sourceMappingURL=LayoutModel.js.map