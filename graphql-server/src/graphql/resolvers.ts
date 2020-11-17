import { initializeEntries } from '../stravaAPI';

export = {
    Query: {
        getAllRuns: async () => {
            return 'Get All Runs';
        },
    },
    Mutation: {
        initializeEntries: async () => {
            await initializeEntries();
            return 'Done';
        },
    },
};
