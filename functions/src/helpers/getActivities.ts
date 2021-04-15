import { ApolloError } from 'apollo-server-express';
import { findActivities } from '../mongoDB';
import { ActivityModel, FindArgs } from '../types';

export default async ({
    year,
    month,
    page,
    perPage,
}: FindArgs): Promise<ActivityModel[]> => {
    try {
        const activities = await findActivities({
            page,
            perPage,
            month,
            year,
        });
        return activities;
    } catch (error) {
        throw new ApolloError(error);
    }
};
