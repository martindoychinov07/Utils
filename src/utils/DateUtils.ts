type DateTimeParts = {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  ms?: number;
  isPM?: boolean;
  tzOffset?: number; // minutes
};

// Build regex and field mapping
const tokenRegex: [RegExp, string, string][] = [
  [/YYYY/,  "~0~", "(?<year>\\d{4})"],
  [/YY/,    "~1~", "(?<year>\\d{2})"],
  [/MM/,    "~2~", "(?<month>\\d{1,2})"],
  [/DD/,    "~3~", "(?<day>\\d{1,2})"],
  [/HH/,    "~4~", "(?<hour>\\d{1,2})?"],
  [/hh/,    "~5~", "(?<hour>\\d{1,2})?"],
  [/mm/,    "~6~", "(?<minute>\\d{1,2})?"],
  [/ss/,    "~7~", "(?<second>\\d{1,2})?"],
  [/SSS/,   "~8~", "(?<ms>\\d{1,3})?"],
  [/A/,     "~9~", "(?<ampm>AM|PM)?"],
  [/a/,     "~A~", "(?<ampm>am|pm)?"],
  [/Z/,     "~B~", "(?<tz>[+-]\\d{2}:?\\d{2}|Z)?"],
];

const regexCache = new Map<string, RegExp>();

function getCachedRegex(pattern: string, flags = ""): RegExp {
  const key = pattern + "/" + flags;
  let regex = regexCache.get(key);
  if (!regex) {
    let text = pattern;

    text = text.trim()
      .replace(/\s+/g, "\\s*");

    for (const [token, sub, ] of tokenRegex) {
      text = text.replace(token, sub);
    }

    text = text.replace(/~[^~]~|([^~]+)/g, (match, text) => {
      // If 'text' exists, it's a non-~X~ block → wrap it
      return text ? `(${text.replaceAll(".", "\\.")})?` : match;
    });

    for (const [, sub, expr] of tokenRegex) {
      text = text.replace(sub, expr);
    }

    regex = new RegExp(`^${text}$`, flags);
    regexCache.set(key, regex);
  }
  return regex;
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

export const defaultFormatDatetime = "YYYY-MM-DDTHH:mm:ss.SSSZ";

export function parseDate(value: unknown, format?: string | null): Date | null {
  if (isDate(value)) return value;

  if (typeof value === "string") {
    if (value.endsWith("Z")) {
      return new Date(value);
    }

    const regex = getCachedRegex(format ?? defaultFormatDatetime);
    const match = regex.exec(value)
      ?? (format ? null : getCachedRegex(defaultFormatDatetime).exec(value));

    if (!match || !match.groups) return null;

    const g = match.groups;
    const parts: DateTimeParts = {};

    if (g.year) parts.year = parseInt(g.year.length === 2 ? "20" + g.year : g.year, 10);
    if (g.month) parts.month = parseInt(g.month, 10);
    if (g.day) parts.day = parseInt(g.day, 10);
    if (g.hour) parts.hour = parseInt(g.hour, 10);
    if (g.minute) parts.minute = parseInt(g.minute, 10);
    if (g.second) parts.second = parseInt(g.second, 10);
    if (g.ms) parts.ms = parseInt(g.ms, 10);
    if (g.ampm) {
      parts.isPM = /pm/i.test(g.ampm);
      // Adjust for AM/PM
      if (parts.isPM && parts.hour !== undefined && parts.hour < 12) parts.hour += 12;
      if (!parts.isPM && parts.hour === 12) parts.hour = 0;
    }

    // Time zone offset
    if (g.tz && g.tz !== "Z") {
      const [sign, hh, mm] = g.tz.match(/^([+-])(\d{2}):?(\d{2})$/)!.slice(1);
      const offset = parseInt(hh, 10) * 60 + parseInt(mm, 10);
      parts.tzOffset = sign === "+" ? -offset : offset; // reverse sign for Date
    // }
    // else {
      // parts.tzOffset = -new Date().getTimezoneOffset();
    }

    const date = new Date(
      parts.year ?? 1970,
      (parts.month ?? 1) - 1,
      parts.day ?? 1,
      parts.hour ?? 0,
      parts.minute ?? 0,
      parts.second ?? 0,
      parts.ms ?? 0,
    );

    // Adjust for timezone
    if (parts.tzOffset && parts.tzOffset !== 0) {
      date.setMinutes(date.getMinutes() + (parts.tzOffset ?? 0));
    }

    return date;
  }
  return null;
}

export function formatDate(date: Date | null | undefined, format?: string | null) {
  let formatted: string | undefined;

  if (date) {
    const _padStart = (value: number): string => value.toString().padStart(2, '0');
    formatted = (format ?? defaultFormatDatetime)
      .replace(/YYYY/g, _padStart(date.getFullYear()))
      .replace(/DD/g, _padStart(date.getDate()))
      .replace(/MM/g, _padStart(date.getMonth() + 1))
      .replace(/HH/g, _padStart(date.getHours()))
      .replace(/mm/g, _padStart(date.getMinutes()))
      .replace(/ss/g, _padStart(date.getSeconds()))
      .replace(/SSS/g, _padStart(date.getMilliseconds()));
  }
  return formatted;
}

export function prepareDateProps<T extends Record<string, any>>(
  obj: T,
  replacer: (value: any, key: string) => any
): T {
  const entries = Object.entries(obj).map(([key, value]) => {
    if (key.toLowerCase().includes("date")) {
      return [key, replacer(value, key)];
    }
    return [key, value];
  });
  return Object.fromEntries(entries) as T;
}

/**
 * Generate a full calendar array for a month, each entry is a Date object
 * @param year - full year, e.g., 2025
 * @param month - 1-based month (1 = January, 12 = December)
 * @param firstDayOfWeek - 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 * @returns Array of Date objects (padded for full weeks)
 */
export function generateCalendarDates(
  year: number,
  month: number,
  firstDayOfWeek: number = 0,
  hours?: number,
  minutes?: number,
  seconds?: number,
  ms?: number
): Date[] {
  const dates: Date[] = [];

  // First day of the month
  const firstDate = new Date(year, month - 1, 1);
  const startWeekDay = (firstDate.getDay() - firstDayOfWeek + 7) % 7;

  // First date to display (may belong to previous month)
  const startDate = new Date(year, month - 1, 1 - startWeekDay, hours, minutes, seconds, ms);

  // Total days to display: 6 weeks (42 days) ensures full calendar grid
  const totalDays = 42;

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    dates.push(currentDate);
  }

  return dates;
}

export function getDateOffsetMonth(month: number) {
  const currentDate = new Date();
  const res = new Date(currentDate);
  res.setMonth(currentDate.getMonth() + month);
  res.setHours(0, 0, 0, 0);
  return res;
}
export function getDateOffset(date: number, time?: "from" | "to") {
  const currentDate = new Date();
  const res = new Date(currentDate);
  res.setDate(currentDate.getDate() + date);
  if (time === "to") {
    res.setHours(23, 59, 59, 999);
  }
  else {
    res.setHours(0, 0, 0, 0);
  }
  return res;
}