import { initializeEntries, initializeStats } from '../stravaAPI';

export = {
    Query: {
        activities: async () => {
            return [{ name: 'New Activity' }];
        },
        stats: async () => {
            await initializeStats();
            return { type: 'ALL' };
        },
    },
    // Mutation: {
    //     initializeEntries: async () => {
    //         await initializeEntries();
    //         return 'Done';
    //     },
    // },
};
