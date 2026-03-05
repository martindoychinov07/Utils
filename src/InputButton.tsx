import type {ClassNameRule, InputProps} from "./Input.tsx";
import {toClassName} from "./useFormat.tsx";

export function InputButton<T extends object>(props: InputProps<T>) {
  // const form = props.form;
  // const { register } = form;

  let type = props.type;
  if (props.type === "button" || props.type === "confirm") {
    type = "submit";
  }

  const actionValue =
    props.action ??
    props.name ??
    "true";

  const cn: ClassNameRule[] = [
    { addIf: true, add: "w-full btn btn-sm btn-primary" },
    { addIf: !!props.disabled, add: "btn-disabled" },
    { addIf: props.variant === "ghost", add: "btn-ghost" },
    { addIf: props.variant === "title", add: "btn-title" },
  ];

  return (
    <button
      type={type as "button" | "submit" | "reset"}
      name={"action"}
      value={actionValue}
      disabled={props.disabled}
      className={toClassName(cn)}
    >
      {props.prefix}
    </button>
  );
}
