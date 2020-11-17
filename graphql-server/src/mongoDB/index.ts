import { invalid, required } from 'joi';

import mongoose from 'mongoose';
import config from '../utils/config';
import { insertMany } from './queries';

export const connectMongoose = async () => {
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    try {
        if (typeof config.MONGODB_URI !== 'string')
            throw Error('Invaild Mongo URI');
        await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('connected to MongoDB');
    } catch (error) {
        console.error('error connection to MongoDB:', error.message);
    }
};

export const closeMongoose = () => {
    mongoose.connection.close();
};

export { insertMany };
