import { getStravaAccessToken } from '../strava';
import statusLogger from '../utils/statusLogger';
import getNewActivity from './getNewActivity';
import getActivityWeather from './getActivityWeather';
import getActivityLocation from './getActivityLocation';
import { ActivityModel } from '../types';

export default async (newIdsQueue: number[]): Promise<ActivityModel[]> => {
    const accessToken = await getStravaAccessToken();
    const newActivities: ActivityModel[] = [];
    for (const id of newIdsQueue) {
        const activity = await getNewActivity(id, accessToken);
        if (activity === null) continue;
        const location = await getActivityLocation(activity);
        if (location) {
            activity.location_city = location.city;
            activity.location_state = location.state;
            activity.location_country = location.country;
            activity.location_country_code = location.country_code;
        }
        const weather = await getActivityWeather(activity);
        activity.weather = weather;
        const activityValidationError = activity.validateSync();
        if (activityValidationError !== undefined) {
            statusLogger.addValidationError(
                activity.strava_id,
                activityValidationError
            );
            continue;
        }
        newActivities.push(activity);
    }
    return newActivities;
};
