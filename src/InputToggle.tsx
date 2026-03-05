import type {ClassNameRule, InputProps} from "./Input.tsx";
import {toClassName} from "./useFormat.tsx";
import type { Path } from "react-hook-form";

export function InputToggle<T extends object>(props: InputProps<T>) {
  const { register } = props.form;

  const cn: ClassNameRule[] = [
    { addIf: true, add: "w-full btn btn-sm" },
    { addIf: !!props.disabled, add: "btn-disabled" },
    { addIf: props.variant === "ghost", add: "btn-ghost" },
  ];

  return (
    <input
      {...register(props.name as Path<T>)}
      type="checkbox"
      aria-label={props.prefix?.toString()}
      disabled={props.disabled}
      className={toClassName(cn)}
      value={props.action ?? "true"}
    />
  );
}
