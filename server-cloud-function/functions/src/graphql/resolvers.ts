import GraphQLJSON from 'graphql-type-json';
import { getActivities, getActivityByID, getStat, getStats } from '../helpers';

export default {
    JSON: GraphQLJSON,
    Query: {
        activities: async (_root: any, args: any) => {
            return await getActivities(args);
        },
        activity: async (_root: any, args: any) => {
            return await getActivityByID(args);
        },
        stat: async (_root: any, args: { year: number; month: number }) => {
            return await getStat(args);
        },
        stats: async (
            _root: any,
            args: { stats: { year: number; month: number }[] }
        ) => {
            return await getStats(args.stats);
        },
    },
};
