import { ApolloError } from 'apollo-server-express';
import {
    findActivityByID,
    findActivities,
    findStat,
    findStats,
    findAvailableStats,
} from '../mongoDB';
import makeStatID from '../utils/makeStatID';
import { ActivityModel, FindArgs, StatModel } from '../types';
export { default as getNewActivities } from './getNewActivities';
export { default as updateStats } from './updateStats';

export const getActivities = async ({
    year,
    month,
    page,
    perPage,
}: FindArgs): Promise<ActivityModel[]> => {
    const result = [];
    try {
        const activities = await findActivities({
            page,
            perPage,
            month,
            year,
        });
        result.push(...activities);
        return result;
    } catch (error) {
        throw new ApolloError(error);
    }
};

export const getActivityByID = async ({
    id,
}: {
    id: string;
}): Promise<ActivityModel | null> => {
    try {
        const activity = await findActivityByID(id);
        return activity;
    } catch (error) {
        throw new ApolloError(error);
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
        const stat = await findStat(stat_id);
        return stat;
    } catch (error) {
        throw new ApolloError(error);
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
        const stat = await findStats(findFilter);
        return stat;
    } catch (error) {
        throw new ApolloError(error);
    }
};

export const getAvailableStats = async () => {
    try {
        const result = await findAvailableStats();

        return result[0].result;
    } catch (error) {
        throw new ApolloError(error);
    }
};
