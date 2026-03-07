import {defaultFormatDatetime, formatDate, parseDate} from "./DateUtils";
import { formatNumber, normalizeDecimalInput } from "./NumberUtils";
import type {ClassNameRule, InputFormatter} from "./Input";
import {useI18n} from "../context/i18n/useI18n";

export function useFormat() {
  const { t } = useI18n();
  const patternDatetime = t("~format.datetime") ?? defaultFormatDatetime;
  const datetimeFormatter: InputFormatter = (value, format) => {
    const parsed = parseDate(value, !format || patternDatetime.includes(format) ? patternDatetime : format)
      ?? parseDate(value);
    if (parsed) {
      const formatted = formatDate(parsed, format);
      if (value !== formatted) return formatted;
    }
    return undefined;
  }

  const textFormatter: InputFormatter = (value, format) => format !== undefined ? t( `${format}${value}`) : value;

  const inputFormatters: { [key: string]: InputFormatter } =
  {
    "text": textFormatter,

    "select": textFormatter,

    "datetime": datetimeFormatter,

    "number": (value, format, normalize) => {
      if (!format) {
        format = "0.####";
      }
      if (normalize) {
        value = normalizeDecimalInput(value);
      }
      const parsed = Number(value);
      if (isFinite(parsed)) {
        const formatted = formatNumber(parsed, format);
        if (value !== formatted) return formatted;
      }
      return undefined;
    }
  }
  return inputFormatters;
}

export function toFixed(num: number, fraction: number) {
  return Number.isFinite(num) ? num.toFixed(fraction) : undefined;
}

export function toClassName(rules: ClassNameRule[]) {
  return rules.map(c => c.addIf ? c.add : c.orElse).filter(c => c).join(" ");
}
