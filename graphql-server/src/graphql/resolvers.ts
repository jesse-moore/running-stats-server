import { getAllRuns } from '../stravaAPI';

export = {
    Query: {
        getAllRuns: async () => {    
            const runs = await getAllRuns();
            return runs;
        },
    },
};
