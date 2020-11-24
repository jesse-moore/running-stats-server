import Entry from './models/entry';
import Stat from './models/stat';
import { EntryType, Stat as StatType } from '../types';
import { connectMongoose, closeMongoose } from './';

export const insertManyEntries = async (entries: EntryType[]) => {
    try {
        await Entry.insertMany(entries, { ordered: false });
    } catch (error) {
        console.log('Error inserting documents', error.message);
    }
};

export const insertManyStats = async (entries: StatType[]) => {
    try {
        await Stat.insertMany(entries, { ordered: false });
    } catch (error) {
        console.log('Error inserting documents', error.message);
    }
};

export const getActivities = async () => {
    try {
        const activities = await Entry.find();
        return (activities as unknown) as EntryType[];
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
