import Joi, { string } from 'joi';
import { EntryType } from '../types';

const numberSchema = Joi.number().max(1000000).empty().default(0);
const stringSchema = Joi.string().max(20).truncate().empty('');
const dateSchema = Joi.date().default(null);
const latSchema = Joi.number().min(-90).max(90);
const lngSchema = Joi.number().min(-180).max(180);
const latlngSchema = Joi.array().items(latSchema, lngSchema);

const schema = Joi.object({
    name: stringSchema.default('Unknown Name'),
    distance: numberSchema,
    moving_time: numberSchema,
    elapsed_time: numberSchema,
    total_elevation_gain: numberSchema,
    type: stringSchema.default('Unknown Type'),
    workout_type: numberSchema,
    strava_id: Joi.number().max(999999999999).required(),
    start_date: dateSchema,
    start_date_local: dateSchema,
    timezone: stringSchema,
    utc_offset: Joi.number().min(-86400).max(86400).empty().default(null),
    start_latlng: latlngSchema,
    end_latlng: latlngSchema,
    location_city: Joi.string().max(50).allow(null),
    location_state: Joi.string().max(50).allow(null),
    location_country: Joi.string().max(50).allow(null),
    start_latitude: latSchema,
    start_longitude: lngSchema,
    map: {
        id: stringSchema.default(null),
        summary_polyline: Joi.string().max(100000).empty('').default(null),
        resource_state: numberSchema,
    },
    average_speed: numberSchema,
    max_speed: numberSchema,
    elev_high: numberSchema,
    elev_low: numberSchema,
})
    .rename('id', 'strava_id')
    .options({ stripUnknown: true });

export const parseEntries = (entries: EntryType[]): EntryType[] => {
    if (!Array.isArray(entries)) {
        throw new Error('Invaild Entry');
    }
    return entries.map(parseEntry);
};

const parseEntry = (entry: any): EntryType => {
    const { value, error } = schema.validate(entry);
    if (error) {
        console.log(value);
        throw Error(error.message);
    }
    return value;
};
