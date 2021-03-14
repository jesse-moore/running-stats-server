import dayjs from 'dayjs';
import Stat from '../mongoDB/models/stat';
import makeStatID from './makeStatID';
import { ActivityModel, StatModel, TopActivityMetrics } from '../types';
import StatusMessage from './statusLogger';

function calcStats(
    activities: ActivityModel[],
    stats: StatModel[] | null,
    topActivitiesMetrics: Map<string, { [k: string]: any }> = new Map()
): StatModel[] {
    const statMap = new Map<number, StatModel>();
    if (Array.isArray(stats)) {
        stats.forEach((stat) => {
            statMap.set(stat.stat_id, stat);
        });
    }

    activities.forEach((activity) => {
        if (activity.type !== 'Run' && activity.type !== 'VirtualRun') return;
        const date = new Date(activity.start_date_local);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const statIdYear = makeStatID(year, null);
        const statIdYearMonth = makeStatID(year, month);
        topActivitiesMetrics.set(
            activity._id.toHexString(),
            activity.toObject()
        );

        if (!statMap.has(0)) {
            const newStat = new Stat({
                year: null,
                month: null,
            });
            statMap.set(0, newStat);
        }

        if (!statMap.has(statIdYear)) {
            const newStat = new Stat({ year, month: null });
            statMap.set(statIdYear, newStat);
        }

        if (!statMap.has(statIdYearMonth)) {
            const newStat = new Stat({ year, month });
            statMap.set(statIdYearMonth, newStat);
        }

        const allStat = statMap.get(0);
        const yearStat = statMap.get(statIdYear);
        const monthStat = statMap.get(statIdYearMonth);

        [allStat, yearStat, monthStat].forEach((stat) => {
            if (!stat) return;
            addActivityToStat(stat, activity, topActivitiesMetrics);
            const statValidationError = stat.validateSync();
            if (statValidationError?.name) {
                StatusMessage.addValidationError(
                    stat.stat_id,
                    statValidationError
                );
                throw Error('Stat Validation Error');
            }
        });
    });
    return Array.from(statMap.values());
}

function addActivityToStat(
    stat: StatModel,
    activity: ActivityModel,
    topActivitiesMetrics: Map<string, { [k: string]: any }>
) {
    stat.count++;
    stat.total_distance += activity.distance;
    stat.average_distance = stat.total_distance / stat.count;
    stat.total_elev_gain += activity.total_elevation_gain;
    stat.average_elev_gain = stat.total_elev_gain / stat.count;
    stat.total_moving_time += activity.moving_time;
    stat.average_moving_time = stat.total_moving_time / stat.count;
    stat.average_speed = stat.total_distance / stat.total_moving_time;

    const date = new Date(activity.start_date_local);
    const hour = date.getUTCHours();
    if (hour < 3) stat.periodOfDay.night++;
    else if (hour < 7) stat.periodOfDay.earlyMorning++;
    else if (hour < 12) stat.periodOfDay.morning++;
    else if (hour < 17) stat.periodOfDay.afternoon++;
    else if (hour < 21) stat.periodOfDay.evening++;
    else if (hour >= 21) stat.periodOfDay.night++;

    const dayOfWeek = dayjs(date).format('dd').toLowerCase();
    stat.daysOfWeek[dayOfWeek]++;

    TopActivityMetrics.forEach((metric) => {
        const id: string = activity._id.toHexString();
        calcTopActivities(stat, id, metric, topActivitiesMetrics);
    });
}

function calcTopActivities(
    stat: StatModel,
    id: string,
    metric: { key: string; measure: string },
    topActivitiesMetrics: Map<string, { [k: string]: any }>
) {
    const { key, measure } = metric;
    const topActivities = stat.topActivities
        .get(key)
        ?.map((_id) => _id.toHexString());
    if (topActivities) {
        const newArr = [...topActivities, id];

        newArr.sort((a, b) => {
            // TODO Needs to be partial Activity Model
            const aActivity: any = topActivitiesMetrics.get(a);
            const bActivity: any = topActivitiesMetrics.get(b);
            if (aActivity === undefined || bActivity === undefined) {
                // TODO Throw Error Here
                return 0;
            }
            const aValue = aActivity[key];
            const bValue = bActivity[key];
            if (typeof aValue !== 'number' || typeof bValue !== 'number') {
                // TODO Throw Error Here
                return 0;
            }
            if (measure === 'highest') return bValue - aValue;
            return aValue - bValue;
        });
        if (newArr.length > 5) {
            newArr.pop();
        }
        stat.set(`topActivities.${key}`, newArr);
    } else {
        stat.set(`topActivities.${key}`, [id]);
    }
}

export default calcStats;
