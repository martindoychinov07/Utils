import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useAsyncState } from "./async/useAsyncState";
import { AsyncFragment } from "./async/AsyncFragment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Table } from "./Table";
import { useFormat } from "./useFormat";
import { useForm } from "react-hook-form";
import { LayoutInput } from "./LayoutInput";
import { formatDate, parseDate, prepareDateProps } from "./DateUtils";
import { useConfirm } from "./modal/useConfirm";
import { useI18n } from "../context/i18n/useI18n";
import { useCalendar } from "./modal/useCalendar";
import { copyTable, getSelection } from "./TableUtils";
import { useKeyboardNavigation } from "./useKeyboard";
import { findEnabled } from "./LayoutModel";
import { useExport } from "./modal/useExport";
const groupsModal = ["args", "table", "modal"];
const groupsAction = ["args", "table", "action"];
function CrudForm(props) {
    const { t } = useI18n();
    const model = props.model;
    const ID = model.form.inputId;
    const [disabled, setDisabled] = useState(model.form.disabled ?? []);
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
        return { ...(model.form.args ?? {}), ...props.args };
    }, [model.form.args, props.args]);
    const search = useCallback((args) => {
        // console.log("search", ID, { render })
        if (render) {
            const requestBody = prepareDateProps(args, (value) => parseDate(value, t("~format.datetime"))?.toISOString());
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
        const pattern = rule?.slice(3);
        const regex = pattern ? new RegExp(pattern) : undefined;
        const items = layout.items?.map(item => {
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
        const nativeEvent = event?.nativeEvent;
        const submitter = nativeEvent?.submitter;
        const actionName = submitter?.name ?? "action";
        let actionValue = submitter?.value ?? form.action;
        const selected = form.selected ?? [];
        const selectedOne = form.selected?.at(-1);
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
            const content = data.result?.content ?? [];
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
                const found = findIndex(content, selectedOne) ?? 0;
                const merged = [...content.slice(0, found + 1), { [ID]: 0 }, ...content.slice(found + 1)];
                data.update({ ...data.result, content: merged });
                const oldValue = isCopy ? content[found] : undefined;
                const newValue = model.table.defaults
                    ? await model.table.defaults?.(oldValue, actionValue)
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
                        const found = findIndex(content, String(entry[ID] ?? selectedOne));
                        if (found >= 0) {
                            const requestBody = prepareDateProps(entry, (value) => parseDate(value, t("~format.datetime"))?.toISOString());
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
                if (String(entry?.[ID]) === "0") {
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
                if (question.result?.confirmed) {
                    for (let i = 0; i < selected.length; i++) {
                        const id = Number(selected[i]);
                        if (isFinite(id) && model.action.remove) {
                            await model.action.remove({ id });
                        }
                    }
                    const ids = new Set(selected);
                    data.update({ ...data.result, content: data.result?.content?.filter(entry => !ids.has(String(entry[ID]))) });
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
                if (csv.confirmed) {
                    copyTable(tableRef, tableContext, csv.bom, csv.sep, csv.eol);
                }
            }
            else if (actionValue === "close") {
                props.close?.({ resolve: {}, reject: "code" });
                formUse.setValue("action", "search"); // TODO
            }
            else if (actionValue === "confirm") {
                if (!selected.length) {
                    infoSelectRequired();
                    return;
                }
                const found = findAll(content, selected);
                props.close?.({ resolve: { args: form.args, action: actionValue, result: found } });
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
                        const res = await modalCalendar.value({
                            date: parseDate(formUse.getValues(value), t("~format.datetime"))
                        });
                        if (res.result) {
                            const result = res.result;
                            // ensure we pass a Date to formatDate
                            const dateValue = result.date instanceof Date ? result.date : new Date(result.date);
                            formUse.setValue(value, formatDate(dateValue, t("~format.datetime")));
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
            const current = model.fields.layout.items
                ?.find(item => item.name === name);
            if (current) {
                setDisabled(prev => {
                    const set = new Set(prev);
                    current.disable?.forEach(set.add, set);
                    current.enable?.forEach(set.delete, set);
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
            return formUse.handleSubmit(data => onSubmit?.({ ...data, action: action }))();
        }
        else {
            return formUse.handleSubmit(onSubmit)();
        }
    }, [formUse, model, onSubmit]);
    useEffect(() => {
        const subscription = formUse.watch((values, { name, type }) => {
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
                        setTableLayout(getTableLayout(tableLayout, values?.args?.view));
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
    const cols = model.fields.layout.columns ?? 1;
    const handleSelect = (data, index, ctrlKey, shiftKey) => {
        if (!disabled.includes("edit")) {
            let res;
            if (index === null) {
                res = [];
            }
            else {
                const selection = args.selection ?? (props.close ? "one" : "many");
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
                    if (group !== "table")
                        return (_jsx("div", { children: _jsx("div", { className: `grid lg:grid-cols-${cols} gap-1 p-1`, children: model.fields.layout.items
                                    ?.filter(item => item.group === group)
                                    .map((item, index) => {
                                    const optionsKey = item.source;
                                    const options = optionsKey ? model.fields.options[optionsKey] : undefined;
                                    return (_jsx(LayoutInput, { form: formUse, variant: item.variant ?? "title", item: item, index: index, formatter: formatters[item.type ?? "none"], options: options, disabled: !!item.name && disabled.includes(item.name) }, item.name ?? index));
                                }) }, "content") }, group));
                    if (group === "table") {
                        const selected = formUse.getValues("selected") ?? [];
                        const selectedOne = selected.at(-1);
                        return (_jsx("div", { className: "flex-1 overflow-y-auto", children: _jsx(AsyncFragment, { asyncState: data, onError: (error, children) => {
                                    return _jsx("b", { style: { whiteSpace: "pre" }, children: JSON.stringify(error, null, "  ") });
                                }, children: _jsx(Table, { onTableRef: el => (tableRef.current = el), context: tableContext, data: data.result?.content ?? [], dataKey: ID, formatters: formatters, layout: tableLayout, pager: (position) => {
                                        const size = data.result?.page?.size;
                                        const page = data.result?.page?.number;
                                        const pages = data.result?.page?.totalPages ?? 0;
                                        const count = data.result?.page?.totalElements ?? 0;
                                        if (page !== undefined && size !== undefined && pages > 0) {
                                            if (position === "next") {
                                                return _jsxs("div", { className: "pl-8 cursor-pointer", onMouseEnter: (e) => {
                                                        if (pages > 1) {
                                                            const values = formUse.getValues();
                                                            formUse.reset({
                                                                ...values,
                                                                args: {
                                                                    ...values.args,
                                                                    size: Number(values.args.size ?? 0) + 100,
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
                                        const key = index !== undefined ? data?.[index]?.[ID] : "*";
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
                                        if (groups.includes("action")) {
                                            if (!disabled.includes("edit")) {
                                                submit("edit");
                                            }
                                        }
                                        else {
                                            const value = String(entry?.[ID] ?? "*");
                                            formUse.setValue("selected", [value], {
                                                shouldDirty: false,
                                                shouldTouch: false,
                                                shouldValidate: false,
                                            });
                                            submit("confirm");
                                        }
                                    }, children: (props) => {
                                        const optionsKey = props.item.source;
                                        const options = optionsKey ? model.table.options[optionsKey] : undefined;
                                        if (edit && String(props.entry[ID]) === selectedOne) {
                                            return (_jsx(LayoutInput, { variant: "bordered", form: formUse, item: props.item, index: props.index, formatter: props.item.source ? undefined : formatters[props.item.type ?? "none"], options: options, disabled: props.item.mode === "disabled" || (!!props.item.name && disabled.includes(props.item.name)) }, props.item.name ?? props.index));
                                        }
                                        let value = props.item.name ? props.entry[props.item.name]?.toString() : "";
                                        if (props.formatter && value) {
                                            value = props.formatter(value, props.item.source ? props.item.format : t(props.item.format)) ?? value;
                                        }
                                        return (_jsx("div", { className: props.item.type === "number" ? "text-right" : undefined, children: value }, props.item.name ?? props.index));
                                    } }) }) }, group));
                    }
                }) }, "form"), modalConfirm.component, modalCalendar.component, modalExport.component, props.children] }));
    // console.timeEnd(ID.toString());
    return res;
}
export default CrudForm;
//# sourceMappingURL=CrudForm.js.map