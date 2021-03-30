import { StatModel } from '../types';

export default (stats: StatModel[]): string[] => {
    const idsSet = new Set<string>();
    stats.forEach((stat) => {
        stat.topActivities.forEach((metric) => {
            metric.forEach((id) => {
                idsSet.add(id.toHexString());
            });
        });
    });

    return Array.from(idsSet);
};