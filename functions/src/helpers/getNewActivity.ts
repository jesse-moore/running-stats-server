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
    newActivity.best_efforts = parseBestEfforts(newActivity);
    const activity = new Activity(newActivity);
    return activity;
};

function parseBestEfforts({ best_efforts }: any): BestEfforts[] | null {
    if (!best_efforts || !Array.isArray(best_efforts)) return null;
    return best_efforts.map((effort) => {
        const { name, start_index, end_index, elapsed_time, distance } = effort;
        return { name, start_index, end_index, elapsed_time, distance };
    });
}

interface BestEfforts {
    name: string;
    start_index: number;
    end_index: number;
    elapsed_time: number;
    distance: number;
}
