import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
import server from './functions/server';
import strava_webhook from './functions/strava-webhook';
import updateByID from './functions/updateActivityById';
import keys from './keys.json';

// Obfuscates endpoints
exports[keys.WEBHOOK_NAME] = functions.https.onRequest(strava_webhook);
// exports[keys.UPDATE_BY_ID] = functions.firestore
//     .document('admin/stravaQueue')
//     .onUpdate(updateByID);
exports[keys.UPDATE_BY_ID] = functions
    .runWith({ timeoutSeconds: 5 })
    .https.onRequest(updateByID);

exports.strava = functions.https.onRequest(server);
