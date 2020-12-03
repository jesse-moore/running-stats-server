import { gql } from 'apollo-server';
import { WriteError } from 'mongodb';

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

    type DataBaseResponse {
        insertedCount: Int!
        writeErrors: [WriteError]!
    }

    type WriteError {
        index: Int
        code: Int
        errmsg: String
        op: [Activity]
    }

    extend type Mutation {
        initializeActivities: DataBaseResponse
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
