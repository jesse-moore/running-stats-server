const { gql } = require('apollo-server');

module.exports = gql`
    type Query {
        getAllRuns: String
    }
    type Mutation {
        initializeEntries: String
    }
`;