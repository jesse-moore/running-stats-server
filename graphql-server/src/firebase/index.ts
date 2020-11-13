import * as admin from 'firebase-admin';
const serviceAccount = require('./firebase.key.json');
import { getStravaAccessToken, saveNewToken } from './queries';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://strava-stats-aac46.firebaseio.com',
});

const db = admin.firestore();

export { db, getStravaAccessToken, saveNewToken };
