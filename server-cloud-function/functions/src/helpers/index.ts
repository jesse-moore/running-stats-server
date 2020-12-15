import { ApolloError } from 'apollo-server-express';
import {
    connectMongoose,
    closeMongoose,
    findActivityByID,
    findActivities,
    findStat,
    findStats,
} from '../mongoDB';
import makeStatID from '../utils/makeStatID';
import { ActivityModel, FindArgs, StatModel } from '../types';

export const getActivities = async ({
    year,
    month,
    page,
    perPage,
}: FindArgs): Promise<ActivityModel[]> => {
    const result = [];
    try {
        await connectMongoose();
        const activities = await findActivities({
            page,
            perPage,
            month,
            year,
        });
        result.push(...activities);
        await closeMongoose();
        return result;
    } catch (error) {
        throw new ApolloError(error.message);
    }
};

export const getActivityByID = async ({
    id,
}: {
    id: string;
}): Promise<ActivityModel | null> => {
    try {
        await connectMongoose();
        const activity = await findActivityByID(id);
        await closeMongoose();
        return activity;
    } catch (error) {
        throw new ApolloError(error.message);
    }
};

export const getStat = async ({
    year,
    month,
}: {
    year: number;
    month: number;
}): Promise<StatModel | null> => {
    try {
        if (month && !year) {
            throw new ApolloError('year required with month');
        }
        const stat_id = makeStatID(year, month);
        await connectMongoose();
        const stat = await findStat(stat_id);
        await closeMongoose();
        return stat;
    } catch (error) {
        throw new ApolloError(error.message);
    }
};

export const getStats = async (
    args: { year: number; month: number }[]
): Promise<StatModel[] | null> => {
    try {
        const stat_ids = args.map(({ month, year }) => {
            if (month && !year) {
                throw new ApolloError('year required with month');
            }
            return makeStatID(year, month);
        });
        const findFilter = [...new Set(stat_ids)].map((stat_id) => {
            return { stat_id };
        });
        await connectMongoose();
        const stat = await findStats(findFilter);
        await closeMongoose();
        return stat;
    } catch (error) {
        throw new ApolloError(error.message);
    }
};
