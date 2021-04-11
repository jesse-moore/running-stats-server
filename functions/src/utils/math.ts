export function toFixed(num: number, places: number): number {
    return Math.round(10 ** places * num) / 10 ** places;
}

export function max(a: number, b: number) {
    if (a === null) return b;
    return a < b ? b : a;
}

export function min(a: number, b: number) {
    if (a === null) return b;
    return a > b ? b : a;
}