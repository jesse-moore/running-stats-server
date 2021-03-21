import calcStats from '../utils/calcStats';
import { ActivityModel, StatModel, TopActivityMetrics } from '../types';
import makeStatID from '../utils/makeStatID';
import { findStats, findActivitiesById } from '../mongoDB';

export default async (activities: ActivityModel[]) => {
    try {
        const stat_ids = new Set<number>();
        activities.forEach(({ year, month }) => {
            stat_ids.add(makeStatID(year, month));
            stat_ids.add(makeStatID(year, null));
        });

        const findFilter = [...stat_ids, 0].map((stat_id) => {
            return { stat_id };
        });

        const currentStats = await findStats(findFilter);
        const topActivitiesMetrics = await getTopActivitiesMetrics(
            currentStats
        );
        const newStats = calcStats(
            activities,
            currentStats,
            topActivitiesMetrics
        );
        return newStats;
    } catch (error) {
        console.error('Failed to update stats');
        console.error(error.message);
        throw new Error();
    }
};

const getUniqueTopActivityIds = (stats: StatModel[]): string[] => {
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

const getTopActivitiesMetrics = async (
    stats: StatModel[] | null
): Promise<Map<string, { [k: string]: any }>> => {
    if (!stats || stats.length === 0) return new Map();
    const ids = getUniqueTopActivityIds(stats);
    const projection: { [k: string]: number } = {};
    TopActivityMetrics.forEach((metric) => (projection[metric.key] = 1));
    const topActivitiesMetrics = await findActivitiesById({ ids, projection });
    const metricsMap: Map<string, { [k: string]: any }> = new Map();
    topActivitiesMetrics.forEach((activity) => {
        metricsMap.set(activity._id.toString(), activity.toObject());
    });
    return metricsMap;
};
