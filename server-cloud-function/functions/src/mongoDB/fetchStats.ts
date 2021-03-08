import Stat from './models/stat';
import { StatModel } from '../types';

export default async (
    statsIds: { stat_id: number }[]
): Promise<StatModel[]> => {
    try {
        // TODO Only populates first element in array with Mongoose@5.11.18
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
        // TODO handle error
        throw Error('Failed to fetch current stats');
    }
};
