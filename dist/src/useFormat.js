import { defaultFormatDatetime, formatDate, parseDate } from "./DateUtils.ts";
import { formatNumber, normalizeDecimalInput } from "./NumberUtils.ts";
import { useI18n } from "../context/i18n/useI18n.tsx";
export function useFormat() {
    var _a;
    const { t } = useI18n();
    const patternDatetime = (_a = t("~format.datetime")) !== null && _a !== void 0 ? _a : defaultFormatDatetime;
    const datetimeFormatter = (value, format) => {
        var _a;
        const parsed = (_a = parseDate(value, !format || patternDatetime.includes(format) ? patternDatetime : format)) !== null && _a !== void 0 ? _a : parseDate(value);
        if (parsed) {
            const formatted = formatDate(parsed, format);
            if (value !== formatted)
                return formatted;
        }
        return undefined;
    };
    const textFormatter = (value, format) => format !== undefined ? t(`${format}${value}`) : value;
    const inputFormatters = {
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
                if (value !== formatted)
                    return formatted;
            }
            return undefined;
        }
    };
    return inputFormatters;
}
export function toFixed(num, fraction) {
    return Number.isFinite(num) ? num.toFixed(fraction) : undefined;
}
export function toClassName(rules) {
    return rules.map(c => c.addIf ? c.add : c.orElse).filter(c => c).join(" ");
}
//# sourceMappingURL=useFormat.js.map