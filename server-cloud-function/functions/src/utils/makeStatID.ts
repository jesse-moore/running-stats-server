export default function makeStatID(year: number, month: number): number {
    if (year === 0) return 0;
    if (year && month) {
        if (month < 10) {
            return Number(`${year}0${month}`);
        } else {
            return Number(`${year}${month}`);
        }
    } else {
        return Number(year) * 100;
    }
}
