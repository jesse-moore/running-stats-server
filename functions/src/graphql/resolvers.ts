import GraphQLJSON from 'graphql-type-json';
import { connectMongoose, closeMongoose } from '../mongoDB';
import {
    getActivities,
    getActivityByID,
    getAvailableStats,
    getStat,
    getStats,
} from '../helpers';

export default {
    JSON: GraphQLJSON,
    Query: {
        activities: async (_root: any, args: any) => {
            await connectMongoose();
            const response = await getActivities(args);
            await closeMongoose();
            return response;
        },
        activity: async (_root: any, args: any) => {
            await connectMongoose();
            const response = await getActivityByID(args);
            await closeMongoose();
            return response;
        },
        stat: async (_root: any, args: { year: number; month: number }) => {
            await connectMongoose();
            const response = await getStat(args);
            await closeMongoose();
            return response;
        },
        stats: async (
            _root: any,
            args: { stats: { year: number; month: number }[] }
        ) => {
            await connectMongoose();
            const response = await getStats(args.stats);
            await closeMongoose();
            return response;
        },
        availableStats: async () => {
            await connectMongoose();
            const response = await getAvailableStats();
            await closeMongoose();
            return response;
        },
    },
};
