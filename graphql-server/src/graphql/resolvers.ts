import {
    getAllRuns,
    initializeEntries,
    ping,
    testRateLimit,
} from '../stravaAPI';

export = {
    Query: {
        getAllRuns: async () => {
            const runs = await getAllRuns();
            return runs;
        },
        ping: async () => {
            return await ping();
        },
    },
    Mutation: {
        initializeEntries: async () => {
            return await initializeEntries();
        },
        testRateLimit: async () => {
            return await testRateLimit();
        },
    },
};
