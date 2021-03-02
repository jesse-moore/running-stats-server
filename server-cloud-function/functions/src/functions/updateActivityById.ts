// import { Change, EventContext, firestore } from 'firebase-functions';
import { getIDQueue } from '../firebase/index';
import { connectMongoose, closeMongoose, getIndexMap } from '../mongoDB';
import Stat from '../mongoDB/models/stat';
import Activity from '../mongoDB/models/activity';
import Weather from '../mongoDB/models/weather';
import { getAccessToken, fetchActivity } from '../strava';
import getWeather from '../virtualCrossing/index';
import StatusMessage from '../utils/statusMessage';
import calcStats from '../utils/calcStats';
import { ActivityModel, IdQueue, StatModel } from '../types';

import { Request, Response } from 'firebase-functions';
import makeStatID from '../utils/makeStatID';

const statusMessage = new StatusMessage();

async function server2(req: Request, res: Response) {
    const data = await server();
    res.json(data);
}

async function server() {
    try {
        const idQueueDoc = await getIDQueue();
        const idQueue: IdQueue | undefined = idQueueDoc.data();
        if (!idQueue || !idQueue.ids || idQueue.ids.length < 1) return;
        statusMessage.totalActivities = idQueue.ids.length;

        await connectMongoose();
        const indexMap = await getIndexMap();

        const newIdsQueue = idQueue.ids.filter((id) => {
            if (indexMap.index.has(`${id}`)) {
                statusMessage.duplicateActivities.push(id);
                return false;
            } else {
                return true;
            }
        });

        if (newIdsQueue.length === 0) return;

        const activities = await getActivities(newIdsQueue);
        const stats = await updateStats(activities);

        // await idQueueDoc.ref.set({ ids: [] });
        console.log('UPDATE');
        return stats;
    } catch (error) {
        console.log(error);
    } finally {
        await closeMongoose();
        statusMessage.logStatus();
    }
}

const getActivities = async (
    newIdsQueue: number[]
): Promise<ActivityModel[]> => {
    const accessToken = await getAccessToken();
    const newActivities: ActivityModel[] = [];
    for (const id of newIdsQueue) {
        const newActivity = await fetchActivity(accessToken, id);
        if (newActivity === null) continue;
        newActivity.strava_id = newActivity.id;
        const activity = new Activity(newActivity);
        const activityValidationError = activity.validateSync();
        if (activityValidationError !== undefined) {
            statusMessage.addValidationError(activityValidationError);
            throw Error('Activity Validation Error');
        }
        statusMessage.validActivities++;

        // const newWeather = await getWeather(activity);
        // if (newWeather === null) continue;
        // const weather = new Weather(newWeather);
        // const weatherValidationError = weather.validateSync();
        // if (weatherValidationError !== undefined) {
        //     statusMessage.addValidationError(weatherValidationError);
        //     statusMessage.failedWeather.push(activity.strava_id);
        // } else {
        //     activity.weather = weather.toObject();
        // }
        newActivities.push(activity);
    }
    return newActivities;
};

const updateStats = async (activities: ActivityModel[]) => {
    const stat_ids = new Set<number>();
    activities.forEach(({ year, month }) => {
        stat_ids.add(makeStatID(year, month));
        stat_ids.add(makeStatID(year, null));
    });

    const findFilter = [...stat_ids, 0].map((stat_id) => {
        return { stat_id };
    });

    const currentStats = await fetchStats(findFilter);
    // const statObj = {};
    // stats.forEach((stat) => {
    //     statObj[stat.stat_id] = stat.toObject();
    // });

    const newStats = calcStats(activities);
    return newStats;

    // await Promise.all(
    //     newStats.map(async (stat) => {
    //         return await Stat.replaceOne({ stat_id: stat.stat_id }, stat, {
    //             upsert: true,
    //         });
    //     })
    // );
};

const fetchStats = async (
    statsIds: { stat_id: number }[]
): Promise<StatModel[]> => {
    try {
        const stats = await Stat.find({
            $or: statsIds,
        })
            .populate('topActivities.distance', { distance: 1 })
            .populate('topActivities.moving_time', { moving_time: 1 })
            .populate('topActivities.total_elevation_gain', {
                total_elevation_gain: 1,
            })
            .populate('topActivities.average_speed', { average_speed: 1 })
            .populate('topActivities.elev_high', { elev_high: 1 })
            .populate('topActivities.elev_low', { elev_low: 1 });
        return stats;
    } catch (error) {
        //Todo handle error
        throw Error('Failed to fetch current stats');
    }
};

export default server2;
