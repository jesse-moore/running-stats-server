import Entry from './models/entry';
import { EntryType } from '../types';

export const insertMany = async (entries: EntryType[]) => {
    try {
        await Entry.insertMany(entries, { ordered: false });
    } catch (error) {
        console.log('Error inserting documents', error.message);
    }
};
