import { initializeEntries, initializeStats } from '../stravaAPI';
import { getStats } from '../mongoDB';
import GraphQLJSON from 'graphql-type-json';

export = {
    JSON: GraphQLJSON,
    Query: {
        activities: async () => {
            return [{ name: 'New Activity' }];
        },
        stats: async () => {
            const stats = await getStats();
            return stats;
        },
    },
    Mutation: {
        initializeStats: async () => {
            const stats = await initializeStats();
            return stats;
        },
        initializeEntries: async () => {
            await initializeEntries();
            return 'Done';
        },
    },
};
