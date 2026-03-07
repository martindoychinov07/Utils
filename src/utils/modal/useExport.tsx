import {useI18n} from "../../context/i18n/useI18n";
import type {ModalComponent, ModalProps} from "./Modal";
import useModal from "./useModal";
import { type ReactNode, useEffect, useMemo } from "react";

interface ExportArgs {
  title?: ReactNode;
  buttons?: "no_yes" | "ok";
}

interface ExportResult {
  bom?: string;
  sep?: string;
  eol?: string;
  confirmed?: boolean;
}

const STORAGE_KEY = "csv";

export function useExport(): ReturnType<typeof useModal> {
  const { t } = useI18n();

  const Content: ModalComponent<ExportResult, ExportArgs> = (props) => {
    useEffect(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const values = JSON.parse(saved);
      Object.entries(values).forEach(([name, value]) => {
        const input = document.querySelector(`[name="${name}"]`) as any;
        if (input) input.value = value;
      });
    });

    const actions = <>
      <button key={"no"} className="w-full btn btn-sm btn-primary mt-4" name={"action"}
              value="no">{t("~confirm.no")}</button>
      <button key={"yes"} className="w-full btn btn-sm btn-primary mt-4" name={"action"}
              value="yes">{t("~confirm.yes")}</button>
    </>

    return <form key={"form"} method="dialog"
      onSubmit={(e) => {
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
        const action = submitter?.value;
        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries()) as ExportResult;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        props.close?.({ resolve: { action: action, result: { confirmed: action === "yes", ...values } } })
      }}>
      <div className={"grid grid-cols-2 gap-1 p-1 min-w-[20em]"}>
        <details className="collapse col-span-2">
          <summary className="collapse-title text-center">{t("~setting.title")} ...</summary>
          <div className="collapse-content grid grid-cols-2 gap-1 p-1">
            <label>BOM</label>
            <select name={"bom"} className={"select select-sm"}>
              <option value={""}></option>
              <option value={"\uFEFF"}>BOM</option>
            </select>
            <label>SEP</label>
            <select name={"sep"} className={"select select-sm"}>
              <option value={" "}>Space</option>
              <option value={"\t"}>Tab</option>
              <option value={","}>Comma</option>
              <option value={";"}>Semicolon</option>
              <option value={"|"}>Pipe</option>
            </select>
            <label>EOL</label>
            <select name={"eol"} className={"select select-sm"}>
              <option value={"\r"}>CR</option>
              <option value={"\n"}>LF</option>
              <option value={"\r\n"}>CRLF</option>
            </select>
          </div>
        </details>
        {actions}
      </div>
    </form>
  }

  const modalProps: ModalProps<ExportResult, ExportArgs> = useMemo(() => (
    {
      header: (props) => {
        return <>{props.args?.title ?? t("~confirm.title")}</>
      },
      children: (props) => {
        return <Content close={props.close} {...props} />
      },
    }
  ), []);

  return useModal(modalProps);
}