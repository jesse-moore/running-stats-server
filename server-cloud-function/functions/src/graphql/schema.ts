const { gql } = require('apollo-server-express');

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
    extend type Query {
        activities(year: Int, month: Int, id: String): [JSON]!
        activity(id: String!): JSON
    }
`;

export default [root, activity];
