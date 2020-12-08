import { ApolloError } from 'apollo-server-express';
import {
    connectMongoose,
    closeMongoose,
    findActivityByID,
    findActivities,
} from '../mongoDB';
import { FindArgs } from '../types';

export const getActivities = async ({
    year,
    month,
    page,
    perPage,
}: FindArgs) => {
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
        console.log(activities.length);
        await closeMongoose();
        return result;
    } catch (error) {
        throw new ApolloError(error.message);
    }
};

export const getActivityByID = async ({ id }: { id: string }) => {
    try {
        await connectMongoose();
        const activity = await findActivityByID(id);
        await closeMongoose();
        return activity;
    } catch (error) {
        throw new ApolloError(error.message);
    }
};
