import Activity from './models/activity';
import Stat from './models/stat';
import { ActivityObject, StatObject } from '../types';
import { connectMongoose, closeMongoose } from './';

export const insertManyActivities = async (activities: ActivityObject[]) => {
    try {
        await Activity.insertMany(activities, { ordered: false });
    } catch (error) {
        console.log('Error inserting documents', error.message);
    }
};

export const insertManyStats = async (activities: StatObject[]) => {
    try {
        await Stat.insertMany(activities, { ordered: false });
    } catch (error) {
        console.log('Error inserting documents', error.message);
    }
};

export const getActivities = async () => {
    try {
        const activities = await Activity.find();
        return (activities as unknown) as ActivityObject[];
    } catch (error) {
        throw Error(error.message);
    }
};

export const getStats = async () => {
    try {
        connectMongoose();
        const stat = await Stat.find({
            type: 'month',
            year: 2020,
            month: 11,
        }).populate('topActivities.distance', {
            start_date_local: 1,
            distance: 1,
        });
        closeMongoose();
        return stat;
    } catch (error) {
        throw Error(error.message);
    }
};
