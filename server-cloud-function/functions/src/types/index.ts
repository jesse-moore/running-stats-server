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
    start_date: string;
    start_date_local: string;
    timezone: string;
    utc_offset: number;
    start_latlng: number[];
    end_latlng: number[];
    location_city: string | null;
    location_state: string | null;
    location_country: string;
    start_latitude: number;
    start_longitude: number;
    map: {
        id: string;
        summary_polyline: string;
        resource_state: number;
    };
    average_speed: number;
    max_speed: number;
    elev_high: number;
    elev_low: number;
}

export interface ActivityModel extends ActivityObject, Document {}

export interface StatObject {
    type: StatType;
    year: number;
    month: number;
    total_distance: number;
    average_distance: number;
    total_elev_gain: number;
    average_elev_gain: number;
    total_moving_time: number;
    average_moving_time: number;
    count: number;
    average_speed: number;
    daysOfWeek: { [k: number]: number };
    periodOfDay: { [k in PeriodOfDay]: number };
    topActivities: {
        distance: string[];
    };
}

export interface InvaildActivityObject {
    error: {
        message: string;
        strava_id: number;
    };
}

export type RawActivityObject = {
    [k: string]: any;
};

enum StatType {
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
