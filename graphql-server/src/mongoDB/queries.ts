import { WriteError, MongoError, ObjectId, InsertWriteOpResult } from 'mongodb';
import Activity from './models/activity';
import Stat from './models/stat';
import { ActivityObject, StatObject } from '../types';
import { connectMongoose, closeMongoose } from './';

export const insertManyActivities = async (activities: ActivityObject[]) => {
    try {
        const response = ((await Activity.insertMany(activities, {
            ordered: false,
            rawResult: true,
        })) as unknown) as InsertWriteOpResult<ActivityObject>;
        const { insertedCount } = response;
        return { insertedCount, writeErrors: [] };
    } catch (error) {
        const result = handleMongoError(error);
        return result;
    }
};

interface MongooseError extends MongoError {
    result: {
        result: {
            writeErrors: WriteError[];
            insertedIds: {
                index: number;
                _id: ObjectId;
            }[];
            nInserted: number;
            nUpserted: number;
            nMatched: number;
            nModified: number;
            nRemoved: number;
        };
    };
}

const handleMongoError = (error: MongooseError) => {
    switch (error.name) {
        case 'BulkWriteError':
            const writeErrors = error.result.result.writeErrors.filter(
                filterDuplicateIDErrors
            );
            return {
                writeErrors,
                insertedCount: error.result.result.nInserted,
            };
        default:
            throw new Error(`Error inserting documents ${error.message}`);
    }
};

const filterDuplicateIDErrors = (e: WriteError) => {
    if (e.code === 11000) return false;
    return true;
};

// InsertWriteOpResult<Pick<any, string | number | symbol> & {
// 	_id: unknown;
// }>

// const handleBulkWriteError = (error: BulkWriteResult) => {
// 	error.
// };

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
