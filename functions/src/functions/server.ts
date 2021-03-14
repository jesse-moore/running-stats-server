import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from '../graphql/schema';
import resolvers from '../graphql/resolvers';

function gqlServer() {
    const app = express();
    const apolloServer = new ApolloServer({
        typeDefs: schema,
        resolvers,
        introspection: true,
    });

    apolloServer.applyMiddleware({ app, path: '/api', cors: true });

    app.get('/', (_req, res) => {
        res.send('Hello from Firebase!');
    });

    return app;
}

export default gqlServer();
