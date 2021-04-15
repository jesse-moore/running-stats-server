export function toFixed(num: number, places: number): number {
    return Math.round(10 ** places * num) / 10 ** places;
}

export function max(a?: number | null, b?: number | null) {
    if ((a === null || a === undefined) && (b === null || b === undefined))
        return null;
    if (a === null || a === undefined) return b;
    if (b === null || b === undefined) return a;
    return a < b ? b : a;
}

export function min(a?: number | null, b?: number | null) {
    if ((a === null || a === undefined) && (b === null || b === undefined))
        return null;
    if (a === null || a === undefined) return b;
    if (b === null || b === undefined) return a;
    return a > b ? b : a;
}
