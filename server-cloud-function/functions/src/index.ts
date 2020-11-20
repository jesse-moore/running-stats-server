import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './graphql/schema';
import resolvers from './graphql/resolvers';

admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
function gqlServer() {
    const app = express();

    const apolloServer = new ApolloServer({
        typeDefs: schema,
        resolvers,
        // Enable graphiql gui
        introspection: true,
        playground: true,
    });

    apolloServer.applyMiddleware({ app, path: '/api', cors: true });

    app.get('/', (_req, res) => {
        res.send('Hello from Firebase!');
    });

    return app;
}

const server = gqlServer();

export const helloWorld = functions.https.onRequest(server);
