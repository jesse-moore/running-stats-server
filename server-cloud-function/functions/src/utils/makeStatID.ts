export default function makeStatID(
    year: number | null,
    month: number | null
): number {
    if (year === null || year === 0) return 0;
    if (month === null || month === 0) return Number(year) * 100;
    if (month < 10) {
        return Number(`${year}0${month}`);
    } else {
        return Number(`${year}${month}`);
    }
}
