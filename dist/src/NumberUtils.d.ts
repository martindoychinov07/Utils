export declare const DECIMAL: RegExp;
export declare const INTEGER: RegExp;
export declare const padNumber: (num: number, digits: number) => string;
export declare const toOptionalFixed: (num: number, digits: number) => string;
export declare const roundNumber: (num: number, decimals?: number) => number;
export declare const toFixedNumber: (num: number, decimals?: number) => number;
export declare const formatNumber: (num: number, format: string) => string | null;
export declare const normalizeDecimalInput: (value: string) => string;
export declare const range: (start: number, end: number, step?: number) => number[];
