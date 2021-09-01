import { Schema, model, models } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { ActivityModel, RawActivityObject } from '../../types';

const latlngSchema = {
    lat: { type: Number, min: -90, max: 90 },
    lng: { type: Number, min: -180, max: 180 },
};

const mapSchema = {
    id: { type: String, maxlength: 60 },
    summary_polyline: { type: String, maxlength: 100000, default: null },
    polyline: { type: String, maxlength: 100000, default: null },
};

const bestEffortSchema = {
    name: String,
    elapsed_time: Number,
    distance: Number,
    start_index: Number,
    end_index: Number,
    _id: false,
};

const weatherSchema = {
    windDirection: Number,
    cloudCover: Number,
    minTemp: Number,
    maxTemp: Number,
    precip: Number,
    solarRadiation: Number,
    dewPoint: Number,
    humidity: Number,
    visibility: Number,
    windSpeed: Number,
    heatIndex: Number,
    snowDepth: Number,
    maxPressure: Number,
    minPressure: Number,
    snow: Number,
    windGust: Number,
    conditions: [String],
    windChill: Number,
    _id: false,
};

const activitySchema = new Schema({
    name: { type: String, default: 'Unknown Name' },
    distance: { type: Number, max: 1000000, default: 0 },
    moving_time: { type: Number, max: 1000000, default: 0 },
    elapsed_time: { type: Number, max: 1000000, default: 0 },
    total_elevation_gain: { type: Number, max: 1000000, default: 0 },
    type: { type: String, default: null },
    workout_type: { type: Number, max: 1000000, default: null },
    strava_id: {
        type: Number,
        max: 999999999999,
        required: true,
        index: true,
        unique: true,
    },
    utc_offset: {
        type: Number,
        min: -86400,
        max: 86400,
        default: null,
        set: (o: number) => o / 60,
    },
    start_date: { type: Date, required: true },
    start_date_local: { type: Date, required: true },
    timezone: String,
    start_latlng: { set: transformLatLng, type: latlngSchema, default: null },
    end_latlng: { set: transformLatLng, type: latlngSchema, default: null },
    location_city: { type: String, default: null },
    location_state: { type: String, default: null },
    location_country: { type: String, default: null },
    location_country_code: { type: String, default: null },
    map: { type: mapSchema, default: null },
    average_speed: { type: Number, max: 1000000, default: null },
    max_speed: { type: Number, max: 1000000, default: null },
    elev_high: { type: Number, max: 1000000, default: null },
    elev_low: { type: Number, max: 1000000, default: null },
    month: { default: setMonth, type: Number, max: 12, min: 1, required: true },
    year: {
        default: setYear,
        type: Number,
        max: new Date().getFullYear(),
        min: 2000,
        required: true,
    },
    weather: { type: weatherSchema, default: null },
    best_efforts: { type: [bestEffortSchema], default: null },
});

function transformLatLng(latLng: [number, number]) {
    if (!latLng || latLng.length < 2) return null;
    return { lat: latLng[0], lng: latLng[1] };
}

function setYear(this: RawActivityObject) {
    // eslint-disable-next-line no-invalid-this
    return dayjs(this.start_date).year();
}

function setMonth(this: RawActivityObject) {
    // eslint-disable-next-line no-invalid-this
    return dayjs(this.start_date).month() + 1;
}

activitySchema.set('toJSON', {
    transform: (
        _document: any,
        returnedObject: { id: any; _id: any; __v: any }
    ) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

export default models.Activity ||
    model<ActivityModel>('Activity', activitySchema);
