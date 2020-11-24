import { EntryType, Stat } from '../../types';
import dayjs from 'dayjs';

const daysOfWeek = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
const periodOfDay = {
    earlyMorning: 0,
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
};

const statObj = {
    total_distance: 0,
    average_distance: 0,
    total_elev_gain: 0,
    average_elev_gain: 0,
    total_moving_time: 0,
    average_moving_time: 0,
    count: 0,
    average_speed: 0,
};

const addActivityToStat = (
    stat: { [k: string]: any },
    activity: EntryType
): void => {
    stat.count++;
    stat.total_distance += activity.distance;
    stat.average_distance = stat.total_distance / stat.count;
    stat.total_elev_gain += activity.total_elevation_gain;
    stat.average_elev_gain = stat.total_elev_gain / stat.count;
    stat.total_moving_time += activity.moving_time;
    stat.average_moving_time = stat.total_moving_time / stat.count;
    stat.average_speed = stat.total_distance / stat.total_moving_time;

    const date = dayjs(activity.start_date);
    const hour = date.hour();
    if (hour < 3) stat.periodOfDay.night++;
    else if (hour < 7) stat.periodOfDay.earlyMorning++;
    else if (hour < 12) stat.periodOfDay.morning++;
    else if (hour < 17) stat.periodOfDay.afternoon++;
    else if (hour < 21) stat.periodOfDay.evening++;
    else if (hour >= 21) stat.periodOfDay.night++;

    const dayOfWeek = date.day();
    stat.daysOfWeek[dayOfWeek]++;

    const topActivityMetrics: { key: keyof EntryType; measure: string }[] = [
        { key: 'distance', measure: 'highest' },
        { key: 'moving_time', measure: 'highest' },
        { key: 'total_elevation_gain', measure: 'highest' },
        { key: 'average_speed', measure: 'highest' },
        { key: 'elev_high', measure: 'highest' },
        { key: 'elev_low', measure: 'lowest' },
    ];
    topActivityMetrics.forEach((metric) => {
        if (metric.key in activity) {
            calcTopActivities(stat, activity, metric);
        }
    });
};

const calcTopActivities = (
    stat: { [k: string]: any },
    activity: EntryType,
    metric: { key: keyof EntryType; measure: string }
): void => {
    const { key, measure } = metric;
    const metricValue = activity[key];
    if (metricValue && metricValue !== null) {
        const topActivities = [];
        if (stat.topActivities[key]) {
            topActivities.push(...stat.topActivities[key]);
        }

        if (topActivities.length < 5) {
            topActivities.push({
                _id: activity._id,
                [key]: metricValue,
            });
        } else if (topActivities[4][key] < metricValue) {
            topActivities.splice(4, 1, {
                _id: activity._id,
                [key]: metricValue,
            });
        }

        topActivities.sort((a, b) => {
            return b[key] - a[key];
        });
        stat.topActivities[key] = topActivities;
    }
};

export const calcStats = (activities: EntryType[]): Stat[] => {
    const stats: { [k: string]: any } = {
        all: {
            type: 'all',
            year: null,
            month: null,
            daysOfWeek: Object.assign({}, daysOfWeek),
            periodOfDay: Object.assign({}, periodOfDay),
            topActivities: Object.assign({}),
            ...statObj,
        },
    };
    activities.forEach((activity) => {
        const date = dayjs(activity.start_date);
        const year = date.year();
        const month = date.month() + 1;
        if (!stats[year])
            stats[year] = {
                type: 'year',
                month: null,
                year,
                daysOfWeek: Object.assign({}, daysOfWeek),
                periodOfDay: Object.assign({}, periodOfDay),
                topActivities: Object.assign({}),
                ...statObj,
            };
        if (!stats[`${month}${year}`])
            stats[`${month}${year}`] = {
                type: 'month',
                year,
                month,
                daysOfWeek: Object.assign({}, daysOfWeek),
                periodOfDay: Object.assign({}, periodOfDay),
                topActivities: Object.assign({}),
                ...statObj,
            };

        addActivityToStat(stats.all, activity);
        addActivityToStat(stats[year], activity);
        addActivityToStat(stats[`${month}${year}`], activity);
    });

    // console.log(stats.all.topActivities);
    // console.log(activities.length);
    const formattedStats = formatStats(stats);
    return formattedStats;
};

function formatStats(stats: { [k: string]: any }) {
    const statsArray = [];
    for (const key in stats) {
        if (Object.prototype.hasOwnProperty.call(stats, key)) {
            const stat = stats[key];
            for (const key in stat.topActivities) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        stat.topActivities,
                        key
                    )
                ) {
                    stat.topActivities[key] = stat.topActivities[key].map(
                        (activity: { [k: string]: any }) => activity._id
                    );
                }
            }
            statsArray.push(stat);
        }
    }
    return statsArray;
}
