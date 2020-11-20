import { graphqlSync } from 'graphql';

import { gql } from 'apollo-server';

const root = gql`
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

    extend type Query {
        activities: [Activity]!
    }
`;

const stat = gql`
    type Stat {
        type: StatType!
    }

    enum StatType {
        ALL
        YEAR
        MONTH
    }

    extend type Query {
        stats: Stat!
    }
`;

module.exports = [root, activity, stat];
