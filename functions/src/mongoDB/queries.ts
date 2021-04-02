import Activity from './models/activity';
import Stat from './models/stat';
import { ActivityModel, StatModel } from '../types';

export const clearDatabase = async () => {
    try {
        await Activity.deleteMany({});
        await Stat.deleteMany({});
    } catch (error) {
        throw new Error(error.message);
    }
};

export const findActivityByID = async (
    id: string
): Promise<ActivityModel | null> => {
    try {
        return await Activity.findById(id);
    } catch (error) {
        if (error.name === 'CastError') throw new Error('Invalid ID');
        throw new Error(error.message);
    }
};

export const getIndexSet = async (): Promise<Set<number>> => {
    try {
        const indexArray = await Activity.distinct('strava_id');
        if (!Array.isArray(indexArray)) {
            throw new Error('Failed to get index');
        }
        return new Set(indexArray);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const findActivities = async ({
    page = 0,
    perPage = 0,
    year,
    month,
}: {
    page: number | undefined;
    perPage: number | undefined;
    year: number | undefined;
    month: number | undefined;
}): Promise<ActivityModel[]> => {
    try {
        const skip = page * perPage;

        const args: { [key: string]: number | string } = { type: 'Run' };
        if (year) args.year = year;
        if (month) args.month = month;
        return await Activity.find(args)
            .sort({ start_date_local: -1 })
            .skip(skip)
            .limit(perPage);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const findActivitiesById = async ({
    ids = [],
    projection = {},
}: {
    ids?: string[];
    projection?: { [k: string]: number };
}): Promise<ActivityModel[]> => {
    try {
        const args = ids.map((_id) => {
            return { _id };
        });
        return await Activity.find({ $or: args }, projection);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const findStat = async (stat_id: number): Promise<StatModel | null> => {
    try {
        return await Stat.findOne({ stat_id });
    } catch (error) {
        throw new Error(error.message);
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
        throw new Error(error.message);
    }
};

export const findAvailableStats = async (): Promise<
    { result: { [k: string]: string[] } }[]
> => {
    try {
        return await Stat.aggregate([
            {
                $group: {
                    _id: '$year',
                    months: {
                        $push: {
                            $ifNull: ['$month', 0],
                        },
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    result: {
                        $push: {
                            k: {
                                $ifNull: [
                                    {
                                        $toString: '$_id',
                                    },
                                    '0',
                                ],
                            },
                            v: '$months',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    result: {
                        $arrayToObject: {
                            $filter: {
                                input: '$result',
                                as: 'item',
                                cond: {
                                    $gt: [
                                        {
                                            $toDouble: '$$item.k',
                                        },
                                        0,
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        ]);
    } catch (error) {
        throw new Error(error.message);
    }
};
