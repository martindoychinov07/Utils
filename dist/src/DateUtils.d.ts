export declare function isDate(value: unknown): value is Date;
export declare const defaultFormatDatetime = "YYYY-MM-DDTHH:mm:ss.SSSZ";
export declare function parseDate(value: unknown, format?: string | null): Date | null;
export declare function formatDate(date: Date | null | undefined, format?: string | null): string;
export declare function prepareDateProps<T extends Record<string, any>>(obj: T, replacer: (value: any, key: string) => any): T;
/**
 * Generate a full calendar array for a month, each entry is a Date object
 * @param year - full year, e.g., 2025
 * @param month - 1-based month (1 = January, 12 = December)
 * @param firstDayOfWeek - 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 * @returns Array of Date objects (padded for full weeks)
 */
export declare function generateCalendarDates(year: number, month: number, firstDayOfWeek?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): Date[];
export declare function getDateOffsetMonth(month: number): Date;
export declare function getDateOffset(date: number, time?: "from" | "to"): Date;
