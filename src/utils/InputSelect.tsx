import { useEffect, useState, type HTMLAttributes } from "react";
import { get } from "react-hook-form";
import type { ClassNameRule, InputOption, InputProps } from "./Input.tsx";
import { useI18n } from "../context/i18n/useI18n";
import { toClassName } from "./useFormat";

export function InputSelect<T extends object>(props: InputProps<T>) {
  const { t } = useI18n();
  const [options, setOptions] = useState<InputOption[]>();

  const { register } = props.form;

  let prefix = props.prefix;
  if (!props.variant || !["label", "compact", "title"].includes(props.variant)) {
    prefix = undefined;
  }

  useEffect(() => {
    async function load() {
      try {
        setOptions(await props.options?.(props.entry));
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [props.options, props.entry]);

  const error = get(props.form.formState.errors, props.name);
  const isInvalid = !!error;

  const cn: ClassNameRule[] = [
    { addIf: true, add: "w-full" },
    { addIf: true, add: "select select-sm" },
    { addIf: props.variant === "label", add: "" },
    { addIf: props.variant === "title", add: "select-title" },
    { addIf: props.variant === "ghost", add: "select-ghost" },
    { addIf: isInvalid, add: "field-state-invalid" },
  ];

  let dataTooltip: HTMLAttributes<unknown> = {};
  if (isInvalid) {
    const message =
      error?.type === "required"
        ? "~validation.required"
        : String(error?.message);

    dataTooltip = {
      "title": t(message)
      // "data-tooltip-id": "tooltip",
      // "data-tooltip-content": t(message),
      // "data-tooltip-place": "bottom-start",
    };
  }

  return (
    <label className={toClassName(cn)} {...dataTooltip}>
      {prefix && <span className="label">{prefix}</span>}
      <select
        key={`${props.name}_${options?.length}`}
        {...register(props.name, props.rules)}
        disabled={props.disabled}
        className="field-input"
        autoComplete={props.autoComplete}
      >
        {options?.map((opt, index) => (
          <option
            key={opt.value ?? index}
            value={opt.value}
            disabled={opt.disabled}
          >
            {t(opt.label)}
          </option>
        ))}
      </select>
    </label>
  );
}
