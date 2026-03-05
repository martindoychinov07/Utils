import {
  type Path,
  type UseFormReturn
} from "react-hook-form";
import { type HTMLInputAutoCompleteAttribute, type HTMLInputTypeAttribute, type ReactNode } from "react";
import { InputSelect } from "./InputSelect.tsx";
import { InputButton } from "./InputButton.tsx";
import InputCommon from "./InputCommon.tsx";
import { InputToggle } from "./InputToggle.tsx";
import { ModalIcon } from "./modal/ModalIcon.tsx";
import type { ItemRules } from "./LayoutModel.ts";

export type InputFormatter = (value: string, format?: string | null | undefined, normalize?: boolean) => string | null | undefined;
export type InputOption = { label: string, value?: string | number, disabled?: boolean };
export type InputOptions<T> = (entry?: T | unknown) => InputOption[] | Promise<InputOption[]>;

export interface InputProps<T extends object> {
  form: UseFormReturn,
  type: HTMLInputTypeAttribute | "select" | undefined,
  name: string,
  prefix?: ReactNode,
  suffix?: ReactNode,
  placeholder?: string,
  variant?: "bordered" | "ghost" | "label" | "compact" | "title",
  autoComplete?: HTMLInputAutoCompleteAttribute,
  formatter?: InputFormatter,
  format?: string | null,
  entry?: T,
  options?: InputOptions<T>,
  action?: string,
  rules?: ItemRules,
  disabled?: boolean
}

export interface ClassNameRule {
  addIf: boolean;
  add: string;
  orElse?: string;
}

export function Input<T extends object>(props: InputProps<T>) {
  switch (props.type) {
    case "select":
      return InputSelect(props);

    case "button":
    case "submit":
    case "reset":
    case "confirm":
      return InputButton(props);

    case "toggle":
      return InputToggle(props);

    case "date":
    case "datetime":
    case "datetime-local":
    case "dialog":
      return InputCommon({
        ...props,
        type: "text",
        suffix: InputButton({
          ...props,
          prefix: <ModalIcon/>,
          type: "button",
          name: "action" as Path<T>,
          action: [props.action, props.name].filter(s => s).join(":"),
          variant: "ghost",
        })
      })
  }

  return InputCommon(props);
}