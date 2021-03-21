const { gql } = require('apollo-server-express');

const root = gql`
    scalar JSON
    type Query {
        root: String
    }
`;

const activity = gql`
    extend type Query {
        activities(
            year: Int
            month: Int
            id: String
            page: Int
            perPage: Int
        ): [Activity]!
        activity(id: String!): Activity
    }

    type Activity {
        name: String
        distance: Float
        moving_time: Int
        elapsed_time: Int
        total_elevation_gain: Float
        type: String
        workout_type: Int
        strava_id: Float
        start_date: String
        start_date_local: String
        timezone: String
        utc_offset: Int
        start_latlng: Latlng
        end_latlng: Latlng
        location_city: String
        location_state: String
        location_country: String
        location_country_code: String
        location_display_name: String
        map: Map
        average_speed: Float
        max_speed: Float
        elev_high: Float
        elev_low: Float
        year: Int
        month: Int
        weather: Weather
    }

    type Latlng {
        lat: Float
        lng: Float
    }

    type Map {
        id: String
        summary_polyline: String
        resource_state: Int
    }

    type Weather {
        windDirection: Float
        cloudCover: Float
        minTemp: Float
        maxTemp: Float
        precip: Float
        solarRadiation: Float
        dewPoint: Float
        humidity: Float
        visibility: Float
        windSpeed: Float
        heatIndex: Float
        snowDepth: Float
        maxPressure: Float
        minPressure: Float
        snow: Float
        windGust: Float
        conditions: [String]
        windChill: Float
    }
`;

const stat = gql`
    extend type Query {
        stat(year: Int, month: Int): Stat!
        stats(stats: [StatInput]): [JSON]!
        availableStats: JSON
    }

    input StatInput {
        year: Int
        month: Int
    }
    type Stat {
        type: String
        stat_id: Int
        year: Int
        month: Int
        total_distance: Float
        average_distance: Float
        total_elev_gain: Float
        average_elev_gain: Float
        total_moving_time: Float
        average_moving_time: Float
        count: Int
        average_speed: Float
        daysOfWeek: JSON
        periodOfDay: JSON
    }
`;

export default [root, activity, stat];
