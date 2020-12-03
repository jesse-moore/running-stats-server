import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers';

import config from './utils/config';

admin.initializeApp();
function gqlServer() {
    const app = express();
    const apolloServer = new ApolloServer({
        typeDefs: schema,
        resolvers,
        introspection: true,
        playground: {
            tabs: [
                {
                    endpoint: config.playground.url,
                    query: 'query { hello }',
                    name: 'Query',
                },
            ],
            //@ts-expect-error:
            settings: { 'schema.polling.enable': false },
        },
    });

    apolloServer.applyMiddleware({ app, path: '/api', cors: true });

    app.get('/', (_req, res) => {
        res.send('Hello from Firebase!');
    });

    return app;
}

const server = gqlServer();

export const strava = functions.https.onRequest(server);
