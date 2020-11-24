import { graphqlSync } from 'graphql';

import { gql } from 'apollo-server';

const root = gql`
    scalar JSON
    type Query {
        root: String
    }
    type Mutation {
        root: String
    }
`;

const activity = gql`
    type Activity {
        name: String!
    }

    extend type Mutation {
        initializeEntries: String
    }

    extend type Query {
        activities: [Activity]!
    }
`;

const stat = gql`
    type Stats {
        stats: JSON
    }

    enum StatType {
        ALL
        YEAR
        MONTH
    }

    extend type Query {
        stats: JSON
    }

    extend type Mutation {
        initializeStats: JSON
    }
`;

module.exports = [root, activity, stat];
