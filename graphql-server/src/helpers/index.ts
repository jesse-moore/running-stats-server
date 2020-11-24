import {
    connectMongoose,
    closeMongoose,
    insertManyActivities,
} from '../mongoDB';
import { fetchActivitiesFromStrava } from '../stravaAPI';
import { parseActivities } from '../utils/validation';

export const initializeActivities = async (): Promise<void> => {
    try {
        const activities = await fetchActivitiesFromStrava();

        const { validEntries, invalidEntries } = parseActivities(activities);

        await connectMongoose();
        await insertManyActivities(validEntries);
        closeMongoose();
        console.log(`Inserted ${validEntries.length} Entries`);
        console.log(`Found ${invalidEntries.length} Invalid Entries`);
    } catch (error) {}
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
