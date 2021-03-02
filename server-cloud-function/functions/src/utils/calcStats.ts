import dayjs from 'dayjs';
import Stat from '../mongoDB/models/stat';
import makeStatID from './makeStatID';
import {
    ActivityModel,
    StatObject,
    StatType,
    PeriodOfDay,
    TopActivities,
    TopActivitiesWithMetrics,
    Metric,
    StatModel,
} from '../types';

const daysOfWeek = { mo: 0, tu: 0, we: 0, th: 0, fr: 0, sa: 0, su: 0 };
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

const topActivitiesObject: TopActivitiesWithMetrics = {
    distance: [],
    moving_time: [],
    total_elevation_gain: [],
    average_speed: [],
    elev_high: [],
    elev_low: [],
};

const statsObj = {
    0: {
        type: StatType.ALL,
        stat_id: 0,
        year: null,
        month: null,
        daysOfWeek: Object.assign({}, daysOfWeek),
        periodOfDay: Object.assign({}, periodOfDay),
        topActivities: Object.assign({}, topActivitiesObject),
        ...statObj,
    },
};

const topActivityMetrics = [
    { key: Metric.DISTANCE, measure: 'highest' },
    { key: Metric.MOVING_TIME, measure: 'highest' },
    { key: Metric.TOTAL_ELEVATION_GAIN, measure: 'highest' },
    { key: Metric.AVERAGE_SPEED, measure: 'highest' },
    { key: Metric.ELEV_HIGH, measure: 'highest' },
    { key: Metric.ELEV_LOW, measure: 'lowest' },
];

type StatsObject = { [k: number]: StatObject };

function calcStats(activities: ActivityModel[], stats: StatsObject = statsObj) {
    activities.forEach((activity) => {
        if (activity.type !== 'Run' && activity.type !== 'VirtualRun') return;
        const date = new Date(activity.start_date_local);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;

        if (!stats.hasOwnProperty(makeStatID(year, null))) {
            const newStatObject: StatObject = {
                type: StatType.YEAR,
                stat_id: makeStatID(year, null),
                month: null,
                year,
                daysOfWeek: Object.assign({}, daysOfWeek),
                periodOfDay: Object.assign({}, periodOfDay),
                topActivities: Object.assign({}, topActivitiesObject),
                ...statObj,
            };
            stats[makeStatID(year, null)] = newStatObject;
        }

        if (!stats.hasOwnProperty(makeStatID(year, month))) {
            const newStatObject: StatObject = {
                type: StatType.MONTH,
                stat_id: makeStatID(year, month),
                month,
                year,
                daysOfWeek: Object.assign({}, daysOfWeek),
                periodOfDay: Object.assign({}, periodOfDay),
                topActivities: Object.assign({}, topActivitiesObject),
                ...statObj,
            };
            stats[makeStatID(year, month)] = newStatObject;
        }
        addActivityToStat(stats[0], activity);
        addActivityToStat(stats[makeStatID(year, null)], activity);
        addActivityToStat(stats[makeStatID(year, month)], activity);
    });
    const formattedStats = formatStats(stats);
    return formattedStats;
}

function addActivityToStat(stat: StatObject, activity: ActivityModel) {
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

    topActivityMetrics.forEach((metric) => {
        if (metric.key in activity) {
            calcTopActivities(stat, activity, metric);
        }
    });
}

function calcTopActivities(
    stat: StatObject,
    activity: ActivityModel,
    metric: { key: Metric; measure: string }
) {
    const { key, measure } = metric;
    const metricValue: number = activity.get(key);
    if (!metricValue || metricValue === null) return;

    if (stat.topActivities.hasOwnProperty(key)) {
        const newArr = [
            ...stat.topActivities[key],
            {
                _id: activity._id,
                value: metricValue,
            },
        ];
        if (measure === 'highest') {
            newArr.sort((a, b) => {
                if (typeof a === 'string' || typeof b === 'string') return 0;
                return b.value - a.value;
            });
        } else if (measure === 'lowest') {
            newArr.sort((a, b) => {
                if (typeof a === 'string' || typeof b === 'string') return 0;
                return a.value - b.value;
            });
        }

        if (newArr.length > 5) {
            newArr.pop();
        }
        Object.defineProperty(stat.topActivities, key, {
            value: newArr,
            enumerable: true,
        });
    } else {
        const newArr = [
            {
                _id: activity._id,
                value: metricValue,
            },
        ];
        Object.defineProperty(stat.topActivities, key, {
            value: newArr,
            enumerable: true,
        });
    }
}

function formatStats(stats: StatsObject): StatObject[] {
    const statsArray = [];
    for (const statKey in stats) {
        const stat = stats[statKey];
        const topActivitiesWithMetrics = <TopActivitiesWithMetrics>(
            stat.topActivities
        );
        const topActivities = <TopActivities>{};
        topActivityMetrics.forEach(({ key }) => {
            topActivities[key] = topActivitiesWithMetrics[key].map(
                (a) => a._id
            );
        });

        stat.topActivities = topActivities;
        statsArray.push(stat);
    }

    return statsArray;
}

export default calcStats;
