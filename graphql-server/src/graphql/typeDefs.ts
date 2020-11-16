const { gql } = require('apollo-server');

module.exports = gql`
    type Query {
		getAllRuns: String
		ping: String
    }
    type Mutation {
		initializeEntries: String
		testRateLimit: String
    }
`;
