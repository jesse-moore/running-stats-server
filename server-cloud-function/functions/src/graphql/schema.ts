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
        stat(year: Int, month: Int): JSON!
        stats(stats: [StatInput]): [JSON]!
        allStats: [JSON]!
    }

    input StatInput {
        year: Int
        month: Int
    }
`;

export default [root, activity, stat];
