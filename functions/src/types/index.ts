import { Document, Types } from 'mongoose';
import { WriteError } from 'mongodb';

export interface ActivityObject {
    name: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    total_elevation_gain: number;
    type: string;
    workout_type: number;
    strava_id: number;
    utc_offset: number;
    start_date: string;
    start_date_local: string;
    timezone: string;
    start_latlng: { lat: number; lng: number };
    end_latlng: { lat: number; lng: number };
    location_city: string | null;
    location_state: string | null;
    location_country: string;
    location_country_code: string;
    map: {
        id: string;
        summary_polyline: string;
        polyline: string;
    };
    average_speed: number;
    max_speed: number;
    elev_high: number;
    elev_low: number;
    month: number;
    year: number;
    weather: WeatherData | null;
    best_efforts: {
        name: string;
        elapsed_time: number;
        distance: number;
        start_index: number;
        end_index: number;
    }[];
}

export interface WeatherData {
    windDirection: number;
    cloudCover: number;
    minTemp: number;
    maxTemp: number;
    precip: number;
    solarRadiation: number;
    dewPoint: number;
    humidity: number;
    visibility: number;
    windSpeed: number;
    heatIndex: number;
    snowDepth: number;
    maxPressure: number;
    minPressure: number;
    snow: number;
    windGust: number;
    conditions: string[];
    windChill: number;
    sunrise: string;
    sunset: string;
    moonPhase: number;
}

export interface WeatherModel extends WeatherData, Document {}

export interface ActivityModel extends ActivityObject, Document {}

export interface StatObject {
    type: StatType;
    stat_id: number;
    year: number | null;
    month: number | null;
    total_distance: number;
    average_distance: number;
    total_elev_gain: number;
    average_elev_gain: number;
    total_moving_time: number;
    average_moving_time: number;
    count: number;
    average_speed: number;
    daysOfWeek: { [k: string]: number };
    periodOfDay: { [k in PeriodOfDay]: number };
    topActivities: TopActivities;
}

export enum Metric {
    DISTANCE = 'distance',
    MOVING_TIME = 'moving_time',
    TOTAL_ELEVATION_GAIN = 'total_elevation_gain',
    AVERAGE_SPEED = 'average_speed',
    ELEV_HIGH = 'elev_high',
    ELEV_LOW = 'elev_low',
}

export const TopActivityMetrics = Object.freeze([
    { key: 'distance', measure: 'highest' },
    { key: 'moving_time', measure: 'highest' },
    { key: 'total_elevation_gain', measure: 'highest' },
    { key: 'average_speed', measure: 'highest' },
    { key: 'elev_high', measure: 'highest' },
    { key: 'elev_low', measure: 'lowest' },
]);

export type TopActivities = Types.Map<Types.ObjectId[]>;

export interface StatModel extends StatObject, Document {}

export interface InvaildActivityObject {
    error: {
        message: string;
        strava_id: number;
    };
}

export type RawActivityObject = {
    [k: string]: any;
};

export interface IdQueue {
    ids?: [number];
}

export interface IdQueueModel
    extends IdQueue,
        FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> {}

export enum StatType {
    ALL = 'all',
    YEAR = 'year',
    MONTH = 'month',
}

export enum PeriodOfDay {
    EARLY_MORNING = 'earlyMorning',
    MORNING = 'morning',
    AFTERNOON = 'afternoon',
    EVENING = 'evening',
    NIGHT = 'night',
}

export type WriteResponse = {
    insertedCount: number;
    writeErrors: WriteError[];
};

export type FindArgs = {
    year?: number;
    month?: number;
    page?: number;
    perPage?: number;
};

export type StravaToken = {
    accessToken: string;
    expiresAt: number;
    refreshToken: string;
};
