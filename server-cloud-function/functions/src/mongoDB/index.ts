import mongoose from 'mongoose';
import config from '../utils/config';

export { findActivityByID, findActivities } from './queries';

export const connectMongoose = async (): Promise<void> => {
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    try {
        if (typeof config.mongodb.uri !== 'string')
            throw Error('Invaild Mongo URI');
        await mongoose.connect(config.mongodb.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error('error connection to MongoDB:', error.message);
    }
};

export const closeMongoose = async (): Promise<void> => {
    await mongoose.connection.close();
};
