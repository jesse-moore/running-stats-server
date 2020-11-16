export interface EntryType {
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
    start_latlng: [number, number];
    end_latlng: [number, number];
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
