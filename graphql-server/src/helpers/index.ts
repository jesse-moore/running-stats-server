import { ApolloError } from 'apollo-server';
import {
    connectMongoose,
    closeMongoose,
    insertManyActivities,
} from '../mongoDB';
import { fetchActivitiesFromStrava } from '../stravaAPI';
import { parseActivities } from '../utils/validation';
import { WriteResponse } from '../types';

export const initializeActivities = async (): Promise<WriteResponse> => {
    try {
        const activities = await fetchActivitiesFromStrava();

        const { validEntries, invalidEntries } = parseActivities(activities);

        await connectMongoose();
        const databaseResponse = await insertManyActivities(validEntries);
        closeMongoose();
        return databaseResponse;
    } catch (error) {
        throw new ApolloError(error.message);
    }
};

export const initializeStats = async () => {
    try {
        await connectMongoose();
        // const activities = await getActivities();
        // const stats = calcStats(activities);
        // const parsedEntries = parseEntries(activities);
        // console.log(JSON.stringify(parsedEntries));
        // console.log(activities[0]);
        // await insertManyStats(stats);
        closeMongoose();
        // return stats;
    } catch (error) {
        console.log(error);
    }
};
