import { Schema, model, ObjectId } from 'mongoose';
import makeStatID from '../../utils/makeStatID';
import {
    StatModel,
    StatObject,
} from '../../types';

const numberDefault = {
    type: Number,
    default: 0,
};

const numberDefaultPositive = {
    type: Number,
    default: 0,
    min: 0,
};

const topActivities: Map<
    string,
    { type: typeof Schema.Types.ObjectId; ref: string }[]
> = new Map([
    ['distance', [{ type: Schema.Types.ObjectId, ref: 'Activity' }]],
    ['moving_time', [{ type: Schema.Types.ObjectId, ref: 'Activity' }]],
    [
        'total_elevation_gain',
        [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    ],
    ['average_speed', [{ type: Schema.Types.ObjectId, ref: 'Activity' }]],
    ['elev_high', [{ type: Schema.Types.ObjectId, ref: 'Activity' }]],
    ['elev_low', [{ type: Schema.Types.ObjectId, ref: 'Activity' }]],
]);

const statSchema = new Schema({
    type: String,
    stat_id: {
        type: Number,
        unique: true,
        // eslint-disable-next-line no-invalid-this
        default: function (this: StatObject) {
            return makeStatID(this.year, this.month);
        },
    },
    year: {
        type: Number,
        max: new Date().getFullYear(),
        min: 2000,
    },
    month: {
        type: Number,
        max: 12,
        min: 1,
    },
    daysOfWeek: {
        mo: numberDefaultPositive,
        tu: numberDefaultPositive,
        we: numberDefaultPositive,
        th: numberDefaultPositive,
        fr: numberDefaultPositive,
        sa: numberDefaultPositive,
        su: numberDefaultPositive,
    },
    periodOfDay: {
        earlyMorning: numberDefaultPositive,
        morning: numberDefaultPositive,
        afternoon: numberDefaultPositive,
        evening: numberDefaultPositive,
        night: numberDefaultPositive,
    },
    topActivities: {
        type: Map,
        of: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
        default: topActivities,
    },
    total_distance: numberDefaultPositive,
    average_distance: numberDefaultPositive,
    total_elev_gain: numberDefault,
    average_elev_gain: numberDefault,
    total_moving_time: numberDefaultPositive,
    average_moving_time: numberDefaultPositive,
    count: numberDefaultPositive,
    average_speed: numberDefaultPositive,
});

statSchema.set('toJSON', {
    transform: (
        _document: any,
        returnedObject: { id: any; _id: any; __v: any }
    ) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

export default model<StatModel>('Stat', statSchema);
