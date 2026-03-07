export const DECIMAL = /^[+\-]?(\d+(\.\d+)?|\.\d+)$/;
export const INTEGER = /^[+\-]?(\d+)$/;
export const padNumber = (num, digits) => `${num}`.padStart(digits, '0');
export const toOptionalFixed = (num, digits) => `${Number.parseFloat(num.toFixed(digits))}`;
export const roundNumber = (num, decimals = 0) => Number(`${Math.round(+`${num}e${decimals}`)}e-${decimals}`);
export const toFixedNumber = (num, decimals = 0) => num.toFixed(decimals);
const _pattern = /^(?<p>#*)(?<i>0*)(?:\.(?<f>0*)(?<s>#*))?$/;
export const formatNumber = (num, format) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const m = (_a = _pattern.exec(format)) === null || _a === void 0 ? void 0 : _a.groups;
    if (!m)
        return null;
    let res = "";
    const hasDecimal = format.includes('.');
    if (hasDecimal) {
        const decimals = ((_c = (_b = m.f) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) + ((_e = (_d = m.s) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0);
        res = num.toFixed(decimals);
        if (m.s) {
            let i = res.length - 1;
            let trimmed = 0;
            while (i >= 0 && res[i] === '0' && trimmed < m.s.length) {
                i--;
                trimmed++;
            }
            if (res[i] === '.')
                i--;
            res = res.slice(0, i + 1);
        }
    }
    else {
        res = num.toFixed(0);
    }
    // Pad integer part
    const minIntDigits = ((_g = (_f = m.i) === null || _f === void 0 ? void 0 : _f.length) !== null && _g !== void 0 ? _g : 0) + ((_j = (_h = m.p) === null || _h === void 0 ? void 0 : _h.length) !== null && _j !== void 0 ? _j : 0);
    if (minIntDigits > 0) {
        const dotIndex = res.indexOf(".");
        const intPartLength = dotIndex >= 0 ? dotIndex : res.length;
        res = res.padStart(minIntDigits + res.length - intPartLength, "0");
    }
    return res;
};
export const normalizeDecimalInput = (value) => {
    let seenSeparator = false;
    let result = "";
    for (let i = value.length - 1; i >= 0; i--) {
        const ch = value[i];
        // skip all whitespace
        if (ch === " " || ch === "\u00A0")
            continue;
        // handle dot / comma
        if (ch === "." || ch === ",") {
            if (seenSeparator)
                continue; // skip extra separators
            seenSeparator = true;
            result = "." + result; // normalize to dot
            continue;
        }
        // keep everything else (digits, minus, etc.)
        result = ch + result;
    }
    return result;
};
export const range = (start, end, step = 1) => Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, i) => start + i * step);
//# sourceMappingURL=NumberUtils.js.map