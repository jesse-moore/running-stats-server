import Activity from '../mongoDB/models/activity';
import { fetchActivityFromStrava } from '../strava';
import { ActivityModel } from '../types';

export default async (
    id: number,
    accessToken: string
): Promise<ActivityModel | null> => {
    const newActivity = await fetchActivityFromStrava(accessToken, id);
    if (newActivity === null) return null;
    newActivity.strava_id = newActivity.id;
    const activity = new Activity(newActivity);
    return activity;
};
