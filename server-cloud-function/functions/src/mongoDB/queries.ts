import Activity from './models/activity';
import { ActivityModel } from '../types';

export const findActivityByID = async (id: string) => {
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
		if (year && month) args.month = month;
        return await Activity.find(args).skip(skip).limit(perPageLimited);
    } catch (error) {
        throw Error(error.message);
    }
};
