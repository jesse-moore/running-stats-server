import { getStravaAccessToken } from '../strava';
import getNewActivity from './getNewActivity';
import getActivityWeather from './getActivityWeather';
import { ActivityModel } from '../types';
import statusLogger from '../utils/statusLogger';

export default async (newIdsQueue: number[]): Promise<ActivityModel[]> => {
    const accessToken = await getStravaAccessToken();
    const newActivities: ActivityModel[] = [];
    for (const id of newIdsQueue) {
        const activity = await getNewActivity(id, accessToken);
        if (activity === null) continue;
        const weather = await getActivityWeather(activity);
        activity.weather = weather;
        newActivities.push(activity);
    }
    return newActivities;
};
