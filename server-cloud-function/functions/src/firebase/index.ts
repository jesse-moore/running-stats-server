import * as admin from 'firebase-admin';
import { IdQueueModel, StravaToken } from '../types';

const db = admin.firestore();

const updateByID = (id: String) => {
    return;
};

const getStravaAccessToken = async (): Promise<StravaToken> => {
    const adminRef = db.collection('admin').doc('strava');
    const doc = await adminRef.get();
    if (!doc.exists) {
        throw new Error('No strava access key found');
    } else {
        const data = doc.data();
        if (data === undefined) throw new Error('No strava access key found');
        return {
            accessToken: data.accessToken,
            expiresAt: data.expiresAt,
            refreshToken: data.refreshToken,
        };
    }
};

const saveNewToken = async (newTokenData: StravaToken): Promise<void> => {
    const adminRef = db.collection('admin').doc('strava');
    await adminRef.set(newTokenData);
};

const addIDToQueue = async (id: String): Promise<void> => {
    const docRef = db.collection('admin').doc('stravaQueue');
    await docRef.update({
        ids: admin.firestore.FieldValue.arrayUnion(id),
    });
};

const getIDQueue = async (): Promise<IdQueueModel> => {
    const docRef = await db.collection('admin').doc('stravaQueue').get();
    return docRef;
};

export {
    admin,
    updateByID,
    addIDToQueue,
    getIDQueue,
    getStravaAccessToken,
    saveNewToken,
};
