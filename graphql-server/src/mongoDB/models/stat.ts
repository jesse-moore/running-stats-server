import { Schema, model } from 'mongoose';

const statSchema = new Schema({
    type: String,
    year: Number,
    month: Number,
    daysOfWeek: {
        1: Number,
        2: Number,
        3: Number,
        4: Number,
        5: Number,
        6: Number,
        7: Number,
    },
    periodOfDay: {
        earlyMorning: Number,
        morning: Number,
        afternoon: Number,
        evening: Number,
        night: Number,
    },
    topActivities: {
        type: Map,
        of: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    },
});

statSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

export default model('Stat', statSchema);
