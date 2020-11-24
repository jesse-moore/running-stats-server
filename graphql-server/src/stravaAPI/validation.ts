import Joi from 'joi';
import dayjs from 'dayjs';
import { EntryType } from '../types';

const numberSchema = Joi.number().max(1000000).empty().default(0).allow(null);
const stringSchema = Joi.string().max(20).truncate().empty('');
const dateSchema = Joi.string().custom(parseDate);
const latSchema = Joi.number().min(-90).max(90);
const lngSchema = Joi.number().min(-180).max(180);
const latlngSchema = Joi.array().items(latSchema, lngSchema).allow(null);

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
    start_latitude: latSchema.allow(null),
    start_longitude: lngSchema.allow(null),
    map: {
        id: stringSchema.default(null),
        summary_polyline: Joi.string()
            .max(100000)
            .empty('')
            .default(null)
            .allow(null),
        resource_state: numberSchema,
    },
    average_speed: numberSchema,
    max_speed: numberSchema,
    elev_high: numberSchema,
    elev_low: numberSchema,
})
    .rename('id', 'strava_id')
    .options({ stripUnknown: true });

interface InvaildEntryType {
    error: {
        message: string;
        strava_id: number;
    };
}

export const parseEntries = (
    entries: EntryType[]
): { validEntries: EntryType[]; invalidEntries: InvaildEntryType[] } => {
    if (!Array.isArray(entries)) {
        throw new Error('Entries is not an Array');
    }
    const validEntries: EntryType[] = [];
    const invalidEntries: InvaildEntryType[] = [];
    entries.forEach((entry) => {
        const validatedEntry = parseEntry(entry);
        if ('error' in validatedEntry) {
            invalidEntries.push(validatedEntry);
        } else {
            validEntries.push(validatedEntry);
        }
    });
    return { validEntries, invalidEntries };
};

const parseEntry = (entry: EntryType): EntryType | InvaildEntryType => {
    const { value, error } = schema.validate(entry);
    if (error) {
        return {
            error: {
                message: error.message,
                strava_id: value.strava_id,
            },
        };
    }
    return value;
};

function parseDate(date: string) {
    const parsedDate = dayjs(date).toISOString();
    const dateSchema = Joi.date().iso();
    const { value, error } = dateSchema.validate(parsedDate);
    if (error) {
        throw Error(error.message);
    }
    return value;
}
