import {useI18n} from "../../context/i18n/useI18n";
import type {ModalComponent, ModalProps} from "./Modal";
import useModal from "./useModal";
import type { ReactNode } from "react";

interface ConfirmArgs {
  title?: ReactNode;
  content?: ReactNode;
  buttons?: "no_yes" | "ok";
}

interface ConfirmResult {
  confirmed?: boolean;
}

export function useConfirm(): ReturnType<typeof useModal> {
  const { t } = useI18n();

  const Content: ModalComponent<ConfirmResult, ConfirmArgs> = (props) => {
    let actions = <></>
    if (props.args?.buttons === undefined || props.args?.buttons === "no_yes") {
      actions = <>
        <button key={"no"} className="w-full btn btn-sm btn-primary mt-4" name={"action"} value="no">{t("~confirm.no")}</button>
        <button key={"yes"} className="w-full btn btn-sm btn-primary mt-4" name={"action"} value="yes">{t("~confirm.yes")}</button>
      </>
    }
    else if (props.args?.buttons === "ok") {
      actions = <>
        <span key={"_"}></span>
        <button key={"yes"} className="w-full btn btn-sm btn-primary mt-4" name={"action"} value="yes">{t("~confirm.ok")}</button>
      </>
    }

    return <form key={"form"} method="dialog"
      onSubmit={(e) => {
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
        const action = submitter?.value;
        props.close?.({ resolve: {action: action, result: { confirmed: action === "yes" }} })
      }}>
      <div className={"grid grid-cols-2 gap-1 p-1 min-w-[20em]"}>
        <div key={"content"} className={"col-span-2"}>{props.args?.content}</div>
        {actions}
      </div>
    </form>
  }

  const modalProps: ModalProps<ConfirmResult, ConfirmArgs> = //useMemo( () => (
    {
      header: (props) => {
        return <>{props.args?.title ?? t("~confirm.title")}</>
      },
      children: (props) => {
        return <Content close={props.close} {...props} />
      },
    }
  //), []);

  return useModal(modalProps);
}