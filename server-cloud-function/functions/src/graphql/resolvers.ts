import GraphQLJSON from 'graphql-type-json';

export default {
    JSON: GraphQLJSON,
    Query: {
        activities: () => 'Hello World',
    },
};
