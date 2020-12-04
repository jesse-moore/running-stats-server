import GraphQLJSON from 'graphql-type-json';
import { getActivities, getActivityByID } from '../helpers';

export default {
    JSON: GraphQLJSON,
    Query: {
        activities: async (_root: any, args: any) => {
            return await getActivities(args);
        },
        activity: async (_root: any, args: any) => {
            return await getActivityByID(args);
        },
    },
};
