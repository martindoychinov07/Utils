import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useAsyncState } from "./async/useAsyncState.tsx";
import { AsyncFragment } from "./async/AsyncFragment.tsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Table } from "./Table.tsx";
import { useFormat } from "./useFormat.tsx";
import { useForm } from "react-hook-form";
import { LayoutInput } from "./LayoutInput.tsx";
import { formatDate, parseDate, prepareDateProps } from "./DateUtils.ts";
import { useConfirm } from "./modal/useConfirm.tsx";
import { useI18n } from "../context/i18n/useI18n.tsx";
import { useCalendar } from "./modal/useCalendar.tsx";
import { copyTable, getSelection } from "./TableUtils.tsx";
import { useKeyboardNavigation } from "./useKeyboard.tsx";
import { findEnabled } from "./LayoutModel.ts";
import { useExport } from "./modal/useExport.tsx";
const groupsModal = ["args", "table", "modal"];
const groupsAction = ["args", "table", "action"];
function CrudForm(props) {
    var _a, _b;
    const { t } = useI18n();
    const model = props.model;
    const ID = model.form.inputId;
    const [disabled, setDisabled] = useState((_a = model.form.disabled) !== null && _a !== void 0 ? _a : []);
    const formatters = useFormat();
    const [groups, setGroups] = useState(props.close ? groupsModal : groupsAction);
    const modalConfirm = useConfirm();
    const modalCalendar = useCalendar();
    const modalExport = useExport();
    const render = (props.close ? props.open !== false : true);
    const tableRef = useRef(null);
    // useEffect(() => {
    //   console.log("init", render, ID);
    // }, []);
    // console.log("render", render, ID);
    async function infoSelectRequired() {
        await modalConfirm.value({ title: t("~confirm.info.title"), content: t("~action.select.required"), buttons: "ok" });
    }
    async function infoSelectOneRequired() {
        await modalConfirm.value({ title: t("~confirm.info.title"), content: t("~action.select.one.required"), buttons: "ok" });
    }
    const tableContext = useMemo(() => (props.close ? "modal." : "") + (ID.replace(/Id$/, "") + "."), [ID, props.close]);
    const args = useMemo(() => {
        var _a;
        return { ...((_a = model.form.args) !== null && _a !== void 0 ? _a : {}), ...props.args };
    }, [model.form.args, props.args]);
    const search = useCallback((args) => {
        // console.log("search", ID, { render })
        if (render) {
            const requestBody = prepareDateProps(args, (value) => { var _a; return (_a = parseDate(value, t("~format.datetime"))) === null || _a === void 0 ? void 0 : _a.toISOString(); });
            return model.action.search(requestBody);
        }
        else {
            return new Promise(resolve => { resolve({}); });
        }
    }, [model.action.search]);
    const data = useAsyncState(search, args);
    const formUse = useForm({
        defaultValues: {
            ...model.form,
            selected: [],
            args
        },
        mode: "onChange",
        shouldUnregister: false
    });
    const action = formUse.getValues("action"); // formUse.watch("action");
    // useEffect(() => {
    //   formUse.reset({ ...model.form, args });
    //   // formUse.setValue("args", { ...formUse.getValues("args"), ...args });
    // }, [formUse, args]); //
    const getTableLayout = useCallback((layout, rule) => {
        var _a;
        const pattern = rule === null || rule === void 0 ? void 0 : rule.slice(3);
        const regex = pattern ? new RegExp(pattern) : undefined;
        const items = (_a = layout.items) === null || _a === void 0 ? void 0 : _a.map(item => {
            if (!regex)
                return { ...item };
            return item.type !== "hidden" && item.name
                ? { ...item, mode: regex.test(item.name) ? "hidden" : undefined }
                : { ...item };
        });
        return {
            ...layout,
            items,
        };
    }, [model]);
    const [tableLayout, setTableLayout] = useState(() => getTableLayout(model.table.layout, model.form.args.view));
    useKeyboardNavigation((ctx) => {
        const name = ctx.current.name;
        let next;
        const edit = name.startsWith("input.");
        if (edit) {
            if (ctx.key === "Escape") {
                submit("cancel");
                ctx.event.preventDefault();
                ctx.event.stopPropagation();
                return null;
            }
            else if (ctx.key === "Enter") {
                submit("save");
                ctx.event.preventDefault();
                ctx.event.stopPropagation();
                return null;
            }
        }
        else {
            if (ctx.key === "Enter") {
                submit("search");
                ctx.event.preventDefault();
                ctx.event.stopPropagation();
                return null;
            }
        }
        const found = findEnabled(edit ? tableLayout.items : model.fields.layout.items, name, ((ctx.key === "ArrowLeft" || ctx.key === "ArrowUp") ? -1 : 1));
        if (found) {
            next = found.group === undefined ? found.name : `${found.group}.${found.name}`;
            if (next) {
                formUse.setFocus(next, { shouldSelect: true });
                ctx.event.preventDefault();
                ctx.event.stopPropagation();
            }
        }
        return null;
    }, [formUse, model.fields.layout.items, tableLayout]);
    const onSubmit = useCallback(async (form, event) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        const nativeEvent = event === null || event === void 0 ? void 0 : event.nativeEvent;
        const submitter = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.submitter;
        const actionName = (_a = submitter === null || submitter === void 0 ? void 0 : submitter.name) !== null && _a !== void 0 ? _a : "action";
        let actionValue = (_b = submitter === null || submitter === void 0 ? void 0 : submitter.value) !== null && _b !== void 0 ? _b : form.action;
        const selected = (_c = form.selected) !== null && _c !== void 0 ? _c : [];
        const selectedOne = (_d = form.selected) === null || _d === void 0 ? void 0 : _d.at(-1);
        function findIndex(list, id) {
            if (id === undefined || !list || !list.length) {
                return -1;
            }
            return list.findIndex(item => String(item[ID]) === id);
        }
        function findAll(list, selected) {
            return selected
                .map(id => list.find(item => String(item[ID]) === id))
                .filter(Boolean);
        }
        if (actionValue) {
            const name = actionValue;
            const content = (_f = (_e = data.result) === null || _e === void 0 ? void 0 : _e.content) !== null && _f !== void 0 ? _f : [];
            if (props.onAction) {
                const found = findAll(content, selected);
                const action = await props.onAction(name, found);
                if (action) {
                    actionValue = action;
                }
                else {
                    return;
                }
            }
            if (actionValue === "search" || actionValue === "default") {
                data.reload({ ...form.args });
                formUse.setValue("selected", []);
                formUse.setValue("action", "search");
            }
            else if (actionValue === "create" || actionValue === "copy") {
                const isCopy = actionValue === "copy";
                if (isCopy && selected.length !== 1) {
                    infoSelectOneRequired();
                    return;
                }
                const found = (_g = findIndex(content, selectedOne)) !== null && _g !== void 0 ? _g : 0;
                const merged = [...content.slice(0, found + 1), { [ID]: 0 }, ...content.slice(found + 1)];
                data.update({ ...data.result, content: merged });
                const oldValue = isCopy ? content[found] : undefined;
                const newValue = model.table.defaults
                    ? await ((_j = (_h = model.table).defaults) === null || _j === void 0 ? void 0 : _j.call(_h, oldValue, actionValue))
                    : oldValue;
                formUse.setValue("selected", [...selected, "0"]);
                formUse.setValue("input", { ...newValue, [ID]: 0 });
                formUse.setValue("action", actionValue);
            }
            else if (actionValue === "edit") {
                if (!selected.length) {
                    infoSelectRequired();
                    return;
                }
                const found = findIndex(content, selectedOne);
                if (found >= 0) {
                    formUse.setValue("action", actionValue);
                    formUse.setValue("input", content[found]);
                }
            }
            else if (actionValue === "save") {
                const isValid = await formUse.trigger();
                if (isValid) {
                    const entry = form.input;
                    if (entry) {
                        const found = findIndex(content, String((_k = entry[ID]) !== null && _k !== void 0 ? _k : selectedOne));
                        if (found >= 0) {
                            const requestBody = prepareDateProps(entry, (value) => { var _a; return (_a = parseDate(value, t("~format.datetime"))) === null || _a === void 0 ? void 0 : _a.toISOString(); });
                            try {
                                if (entry[ID] && model.action.save) {
                                    const id = Number(entry[ID]);
                                    const updated = await model.action.save({ id, requestBody });
                                    const merged = [...content.slice(0, found), updated, ...content.slice(found + 1)];
                                    data.update({ ...data.result, content: merged });
                                }
                                else if (model.action.create) {
                                    const created = await model.action.create({ requestBody });
                                    const merged = [...content.slice(0, found), created, ...content.slice(found + 1)];
                                    data.update({ ...data.result, content: merged });
                                    formUse.setValue("selected", [`${created[ID]}`]);
                                    formUse.setValue("input", undefined);
                                }
                                formUse.setValue("input", undefined);
                                formUse.setValue("action", undefined);
                            }
                            catch (reason) {
                                alert(JSON.stringify(reason));
                            }
                        }
                    }
                }
            }
            else if (actionValue === "cancel") {
                const entry = form.input;
                if (String(entry === null || entry === void 0 ? void 0 : entry[ID]) === "0") {
                    const id = String(0);
                    const found = findIndex(content, id);
                    if (found >= 0) {
                        const merged = [...content.slice(0, found), ...content.slice(found + 1)];
                        formUse.setValue("selected", selected.filter(s => s !== id));
                        data.update({ ...data.result, content: merged });
                    }
                }
                formUse.setValue("input", undefined);
                formUse.setValue("action", actionValue);
            }
            else if (actionValue === "delete") {
                if (!selected.length) {
                    infoSelectRequired();
                    return;
                }
                const question = await modalConfirm.value({
                    title: t("~confirm.delete.title"),
                    content: t("~confirm.question")
                });
                if ((_l = question.result) === null || _l === void 0 ? void 0 : _l.confirmed) {
                    for (let i = 0; i < selected.length; i++) {
                        const id = Number(selected[i]);
                        if (isFinite(id) && model.action.remove) {
                            await model.action.remove({ id });
                        }
                    }
                    const ids = new Set(selected);
                    data.update({ ...data.result, content: (_o = (_m = data.result) === null || _m === void 0 ? void 0 : _m.content) === null || _o === void 0 ? void 0 : _o.filter(entry => !ids.has(String(entry[ID]))) });
                    formUse.setValue("selected", []);
                }
                formUse.setValue("action", "search");
            }
            else if (actionValue === "export") {
                if (!selected.length) {
                    infoSelectRequired();
                    return;
                }
                const question = await modalExport.value({ title: t("~confirm.export.title") });
                const csv = question.result;
                if (csv === null || csv === void 0 ? void 0 : csv.confirmed) {
                    copyTable(tableRef, tableContext, csv.bom, csv.sep, csv.eol);
                }
            }
            else if (actionValue === "close") {
                (_p = props.close) === null || _p === void 0 ? void 0 : _p.call(props, { resolve: {}, reject: "code" });
                formUse.setValue("action", "search"); // TODO
            }
            else if (actionValue === "confirm") {
                if (!selected.length) {
                    infoSelectRequired();
                    return;
                }
                const found = findAll(content, selected);
                (_q = props.close) === null || _q === void 0 ? void 0 : _q.call(props, { resolve: { args: form.args, action: actionValue, result: found } });
                formUse.setValue("action", "search"); // TODO
            }
            else {
                const mi = actionValue.indexOf(":");
                const ti = Math.max(mi, actionValue.lastIndexOf("."));
                if (mi >= 0 && ti > 0) {
                    const fn = actionValue.slice(0, mi);
                    // const path = actionValue.slice(mi + 1, ti);
                    const value = actionValue.slice(mi + 1);
                    // const target = actionValue.slice(ti + 1);
                    // console.log({fn, path, value, target});
                    if (fn === "calendar") {
                        const res = await modalCalendar.value({ date: parseDate(formUse.getValues(value), t("~format.datetime")) });
                        if (res.result) {
                            formUse.setValue(value, formatDate(res.result.date, t("~format.datetime")));
                        }
                    }
                    else {
                        if (props.onAction) {
                            const found = findAll(content, selected);
                            const res = await props.onAction(fn, found, value);
                            if (res) {
                                formUse.setValue(value, res);
                            }
                        }
                    }
                }
            }
            const current = (_r = model.fields.layout.items) === null || _r === void 0 ? void 0 : _r.find(item => item.name === name);
            if (current) {
                setDisabled(prev => {
                    var _a, _b;
                    const set = new Set(prev);
                    (_a = current.disable) === null || _a === void 0 ? void 0 : _a.forEach(set.add, set);
                    (_b = current.enable) === null || _b === void 0 ? void 0 : _b.forEach(set.delete, set);
                    if (prev.length === set.size &&
                        prev.every(v => set.has(v))) {
                        return prev;
                    }
                    return [...set];
                });
            }
        }
    }, [formUse, model, data, props]);
    const submit = useCallback((action) => {
        if (action) {
            return formUse.handleSubmit(data => onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit({ ...data, action: action }))();
        }
        else {
            return formUse.handleSubmit(onSubmit)();
        }
    }, [formUse, model, onSubmit]);
    useEffect(() => {
        const subscription = formUse.watch((values, { name, type }) => {
            var _a;
            if (type === "change" && name) {
                switch (name) {
                    // case "args.page":
                    // case "args.size":
                    case "args.sort":
                    case "args.direction":
                        submit("search");
                        break;
                    case "selected":
                        break;
                    case "mode":
                        setGroups(groups => values.mode
                            ? [...groups.slice(0, -1), "action", ...groups.slice(-1)]
                            : groups.filter(g => g !== "action"));
                        break;
                    case "args.view":
                        setTableLayout(getTableLayout(tableLayout, (_a = values === null || values === void 0 ? void 0 : values.args) === null || _a === void 0 ? void 0 : _a.view));
                        break;
                    default:
                        if (name.startsWith("args.")) {
                            // formUse.setValue("args.page", 0);
                        }
                        break;
                }
            }
        });
        // Cleanup subscription on unmount
        return () => subscription.unsubscribe();
    }, [formUse, getTableLayout, submit, tableLayout]);
    const edit = !props.onAction && action !== undefined && ["edit", "create", "copy"].includes(action);
    const cols = (_b = model.fields.layout.columns) !== null && _b !== void 0 ? _b : 1;
    const handleSelect = (data, index, ctrlKey, shiftKey) => {
        var _a;
        if (!disabled.includes("edit")) {
            let res;
            if (index === null) {
                res = [];
            }
            else {
                const selection = (_a = args.selection) !== null && _a !== void 0 ? _a : (props.close ? "one" : "many");
                const selected = formUse.getValues("selected") || [];
                res = getSelection(selection, selected, ID, data, index, ctrlKey, shiftKey);
            }
            formUse.setValue("selected", res, {
                shouldDirty: false,
                shouldTouch: false,
                shouldValidate: false,
            });
        }
    };
    const res = (_jsxs(_Fragment, { children: [_jsx("form", { onSubmit: formUse.handleSubmit(onSubmit), onReset: () => formUse.reset(), className: "flex-1 flex flex-col overflow-hidden", children: groups.map(group => {
                    var _a, _b, _c, _d;
                    if (group !== "table")
                        return (_jsx("div", { children: _jsx("div", { className: `grid lg:grid-cols-${cols} gap-1 p-1`, children: (_a = model.fields.layout.items) === null || _a === void 0 ? void 0 : _a.filter(item => item.group === group).map((item, index) => {
                                    var _a, _b, _c;
                                    const optionsKey = item.source;
                                    const options = optionsKey ? model.fields.options[optionsKey] : undefined;
                                    return (_jsx(LayoutInput, { form: formUse, variant: (_a = item.variant) !== null && _a !== void 0 ? _a : "title", item: item, index: index, formatter: formatters[(_b = item.type) !== null && _b !== void 0 ? _b : "none"], options: options, disabled: !!item.name && disabled.includes(item.name) }, (_c = item.name) !== null && _c !== void 0 ? _c : index));
                                }) }, "content") }, group));
                    if (group === "table") {
                        const selected = (_b = formUse.getValues("selected")) !== null && _b !== void 0 ? _b : [];
                        const selectedOne = selected.at(-1);
                        return (_jsx("div", { className: "flex-1 overflow-y-auto", children: _jsx(AsyncFragment, { asyncState: data, onError: (error, children) => {
                                    return _jsx("b", { style: { whiteSpace: "pre" }, children: JSON.stringify(error, null, "  ") });
                                }, children: _jsx(Table, { onTableRef: el => (tableRef.current = el), context: tableContext, data: (_d = (_c = data.result) === null || _c === void 0 ? void 0 : _c.content) !== null && _d !== void 0 ? _d : [], dataKey: ID, formatters: formatters, layout: tableLayout, pager: (position) => {
                                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                                        const size = (_b = (_a = data.result) === null || _a === void 0 ? void 0 : _a.page) === null || _b === void 0 ? void 0 : _b.size;
                                        const page = (_d = (_c = data.result) === null || _c === void 0 ? void 0 : _c.page) === null || _d === void 0 ? void 0 : _d.number;
                                        const pages = (_g = (_f = (_e = data.result) === null || _e === void 0 ? void 0 : _e.page) === null || _f === void 0 ? void 0 : _f.totalPages) !== null && _g !== void 0 ? _g : 0;
                                        const count = (_k = (_j = (_h = data.result) === null || _h === void 0 ? void 0 : _h.page) === null || _j === void 0 ? void 0 : _j.totalElements) !== null && _k !== void 0 ? _k : 0;
                                        if (page !== undefined && size !== undefined && pages > 0) {
                                            if (position === "next") {
                                                return _jsxs("div", { className: "pl-8 cursor-pointer", onMouseEnter: (e) => {
                                                        var _a;
                                                        if (pages > 1) {
                                                            const values = formUse.getValues();
                                                            formUse.reset({
                                                                ...values,
                                                                args: {
                                                                    ...values.args,
                                                                    size: Number((_a = values.args.size) !== null && _a !== void 0 ? _a : 0) + 100,
                                                                }
                                                            });
                                                            submit("search");
                                                        }
                                                    }, children: [Math.min((page + 1) * size, count), " / ", count, " (", Math.round(100 * Math.min((page + 1) * size, count) / (count > 0 ? count : 1)), "%)"] });
                                            }
                                        }
                                        else {
                                            return null;
                                        }
                                    }, selector: (data, index) => {
                                        var _a;
                                        const key = index !== undefined ? (_a = data === null || data === void 0 ? void 0 : data[index]) === null || _a === void 0 ? void 0 : _a[ID] : "*";
                                        if (key === null || key === undefined)
                                            return null;
                                        const id = String(key);
                                        return _jsx("input", { ...formUse.register("selected", {
                                                onChange: (e) => {
                                                    if (e.target.value === "*") {
                                                        handleSelect(data, undefined);
                                                    }
                                                }
                                            }), onDoubleClick: (e) => { handleSelect(data, null); e.preventDefault(); e.stopPropagation(); }, type: "checkbox", value: id, className: id !== "*" ? "peer checkbox checkbox-lg bg-base-100" : "checkbox checkbox-lg bg-base-100", disabled: edit }, id);
                                    }, onSort: (name) => {
                                        if (name) {
                                            const values = formUse.getValues();
                                            formUse.reset({
                                                ...values,
                                                args: {
                                                    ...values.args,
                                                    sort: name.toString(),
                                                    direction: (name === values.args.sort) ? (values.args.direction === "ASC" ? "DESC" : "ASC") : "ASC",
                                                }
                                            });
                                            submit("search");
                                        }
                                    }, rowClassName: props.rowClassName, onClick: handleSelect, onDoubleClick: (entry, index) => {
                                        var _a;
                                        if (groups.includes("action")) {
                                            if (!disabled.includes("edit")) {
                                                submit("edit");
                                            }
                                        }
                                        else {
                                            const value = String((_a = entry === null || entry === void 0 ? void 0 : entry[ID]) !== null && _a !== void 0 ? _a : "*");
                                            formUse.setValue("selected", [value], {
                                                shouldDirty: false,
                                                shouldTouch: false,
                                                shouldValidate: false,
                                            });
                                            submit("confirm");
                                        }
                                    }, children: (props) => {
                                        var _a, _b, _c, _d, _e;
                                        const optionsKey = props.item.source;
                                        const options = optionsKey ? model.table.options[optionsKey] : undefined;
                                        if (edit && String(props.entry[ID]) === selectedOne) {
                                            return (_jsx(LayoutInput, { variant: "bordered", form: formUse, item: props.item, index: props.index, formatter: props.item.source ? undefined : formatters[(_a = props.item.type) !== null && _a !== void 0 ? _a : "none"], options: options, disabled: props.item.mode === "disabled" || (!!props.item.name && disabled.includes(props.item.name)) }, (_b = props.item.name) !== null && _b !== void 0 ? _b : props.index));
                                        }
                                        let value = props.item.name ? (_c = props.entry[props.item.name]) === null || _c === void 0 ? void 0 : _c.toString() : "";
                                        if (props.formatter && value) {
                                            value = (_d = props.formatter(value, props.item.source ? props.item.format : t(props.item.format))) !== null && _d !== void 0 ? _d : value;
                                        }
                                        return (_jsx("div", { className: props.item.type === "number" ? "text-right" : undefined, children: value }, (_e = props.item.name) !== null && _e !== void 0 ? _e : props.index));
                                    } }) }) }, group));
                    }
                }) }, "form"), modalConfirm.component, modalCalendar.component, modalExport.component, props.children] }));
    // console.timeEnd(ID.toString());
    return res;
}
export default CrudForm;
//# sourceMappingURL=CrudForm.js.map