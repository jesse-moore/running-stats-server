import { initializeActivities, initializeStats } from '../helpers';
import GraphQLJSON from 'graphql-type-json';

export = {
    JSON: GraphQLJSON,
    Query: {
        activities: async () => {
            return [{ name: 'New Activity' }];
        },
        stats: async () => {
            return { stat: 'STAT' };
        },
    },
    Mutation: {
        initializeStats: async () => {
            // const stats = await initializeStats();
            return { stats: 'STATS' };
        },
        initializeActivities: async () => {
            const response = await initializeActivities();
            return response;
        },
    },
};
