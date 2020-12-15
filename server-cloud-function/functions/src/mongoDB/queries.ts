import Activity from './models/activity';
import Stat from './models/stat';
import { ActivityModel, StatModel } from '../types';

export const findActivityByID = async (
    id: string
): Promise<ActivityModel | null> => {
    try {
        return await Activity.findById(id);
    } catch (error) {
        if (error.name === 'CastError') throw Error('Invalid ID');
        throw Error(error.message);
    }
};
export const findActivities = async ({
    page = 0,
    perPage = 30,
    year,
    month,
}: {
    page: number | undefined;
    perPage: number | undefined;
    year: number | undefined;
    month: number | undefined;
}): Promise<ActivityModel[]> => {
    try {
        const perPageLimited = perPage > 50 ? 50 : perPage;
        const skip = page * perPage;

        const args: { [key: string]: number } = {};
        if (year) args.year = year;
        if (month) args.month = month;
        return await Activity.find(args).skip(skip).limit(perPageLimited);
    } catch (error) {
        throw Error(error.message);
    }
};

export const findStat = async (stat_id: number): Promise<StatModel | null> => {
    try {
        return await Stat.findOne({ stat_id });
    } catch (error) {
        throw Error(error.message);
    }
};

export const findStats = async (
    filter: { stat_id: number }[]
): Promise<StatModel[] | null> => {
    try {
        return await Stat.find({
            $or: filter,
        });
    } catch (error) {
        throw Error(error.message);
    }
};
