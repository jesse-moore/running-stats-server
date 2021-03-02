import { Document } from 'mongoose';
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
    weather: WeatherData;
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
    topActivities: TopActivities | TopActivitiesWithMetrics;
}

export enum Metric {
    DISTANCE = 'distance',
    MOVING_TIME = 'moving_time',
    TOTAL_ELEVATION_GAIN = 'total_elevation_gain',
    AVERAGE_SPEED = 'average_speed',
    ELEV_HIGH = 'elev_high',
    ELEV_LOW = 'elev_low',
}
export interface TopActivitiesWithMetrics {
    distance: { _id: string; value: number }[];
    moving_time: { _id: string; value: number }[];
    total_elevation_gain: { _id: string; value: number }[];
    average_speed: { _id: string; value: number }[];
    elev_high: { _id: string; value: number }[];
    elev_low: { _id: string; value: number }[];
}

export interface TopActivities {
    distance: string[];
    moving_time: string[];
    total_elevation_gain: string[];
    average_speed: string[];
    elev_high: string[];
    elev_low: string[];
}

export interface IndexMapObject {
    of: string;
    index: Map<string, string>;
}

export interface IndexMapModel extends IndexMapObject, Document {}
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
