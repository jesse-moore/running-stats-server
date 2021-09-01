import { ApolloError } from 'apollo-server-express';
import { findActivityByID } from '../mongoDB';
import { ActivityModel } from '../types';

export default async ({
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
