import { ApolloError } from 'apollo-server-express';
import { connectMongoose, closeMongoose, findActivityByID } from '../mongoDB';
import { FindArgs } from '../types';

export const getActivities = async (args: FindArgs) => {
    try {
        // await connectMongoose();
        // await closeMongoose();
        return [];
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
