import {useI18n} from "../../context/i18n/useI18n.tsx";
import type {ModalComponent, ModalProps} from "./Modal.tsx";
import useModal from "./useModal.tsx";
import {Calendar} from "../Calendar.tsx";

interface CalendarArgs {
  title?: string;
  date?: Date | undefined | null;
}

interface CalendarResult {
  date?: Date;
}

export function useCalendar() {
  const { t } = useI18n();

  const Content: ModalComponent<CalendarResult, CalendarArgs> = (props) => {
    return <form key={"form"} method="dialog"
      onSubmit={(e) => {
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
        const action = submitter?.value;
        const date = new Date(action);
        if (date) {
          // date.setMinutes( + new Date().getTimezoneOffset());
          props.close?.({ resolve: { action: "select", result: { date: date } } } );
        }
        else {
          props.close?.({ resolve: {action: "select", result: { date: undefined } }, reject: "code" })
        }
      }}>
      <div className={"grid grid-cols-2 gap-1 p-1 min-w-[20em]"}>
        <div key={"content"} className={"col-span-2"}>
          <Calendar date={props.args?.date} />
        </div>
      </div>
    </form>
  }

  const modalProps: ModalProps<CalendarResult, CalendarArgs> = //useMemo( () => (
    {
      header: (props) => {
        return <>{props.args?.title ?? t("~calendar.title")}</>
      },
      children: (props) => {
        return <Content close={props.close} {...props} />
      },
    }
  //), []);

  return useModal(modalProps);
}