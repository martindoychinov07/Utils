export const DECIMAL = /^[+\-]?(\d+(\.\d+)?|\.\d+)$/;
export const INTEGER = /^[+\-]?(\d+)$/;


export const padNumber = (num: number, digits: number) =>
  `${num}`.padStart(digits, '0');

export const toOptionalFixed = (num: number, digits: number) =>
  `${Number.parseFloat(num.toFixed(digits))}`;

export const roundNumber = (num: number, decimals: number = 0) => Number(`${Math.round(+`${num}e${decimals}`)}e-${decimals}`);

export const toFixedNumber = (num: number, decimals: number = 0) => (num.toFixed(decimals) as unknown) as number;

const _pattern = /^(?<p>#*)(?<i>0*)(?:\.(?<f>0*)(?<s>#*))?$/;

export const formatNumber = (num: number, format: string): string | null => {
  const m = _pattern.exec(format)?.groups;
  if (!m) return null;

  let res = "";
  const hasDecimal = format.includes('.');

  if (hasDecimal) {
    const decimals = (m.f?.length ?? 0) + (m.s?.length ?? 0);
    res = num.toFixed(decimals);

    if (m.s) {
      let i = res.length - 1;
      let trimmed = 0;
      while (i >= 0 && res[i] === '0' && trimmed < m.s.length) {
        i--;
        trimmed++;
      }
      if (res[i] === '.') i--;
      res = res.slice(0, i + 1);
    }
  } else {
    res = num.toFixed(0);
  }

  // Pad integer part
  const minIntDigits = (m.i?.length ?? 0) + (m.p?.length ?? 0);
  if (minIntDigits > 0) {
    const dotIndex = res.indexOf(".");
    const intPartLength = dotIndex >= 0 ? dotIndex : res.length;
    res = res.padStart(minIntDigits + res.length - intPartLength, "0");
  }

  return res;
};

export const normalizeDecimalInput = (value: string): string => {
  let seenSeparator = false;
  let result = "";

  for (let i = value.length - 1; i >= 0; i--) {
    const ch = value[i];

    // skip all whitespace
    if (ch === " " || ch === "\u00A0") continue;

    // handle dot / comma
    if (ch === "." || ch === ",") {
      if (seenSeparator) continue; // skip extra separators
      seenSeparator = true;
      result = "." + result;       // normalize to dot
      continue;
    }

    // keep everything else (digits, minus, etc.)
    result = ch + result;
  }

  return result;
};

export const range = (start: number, end: number, step: number = 1) =>
  Array.from(
    { length: Math.floor((end - start) / step) + 1 },
    (_, i) => start + i * step
  );