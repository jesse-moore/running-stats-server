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
        ): [JSON]!
        activity(id: String!): JSON
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
