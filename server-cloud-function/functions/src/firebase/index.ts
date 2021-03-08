import * as admin from 'firebase-admin';
import { IdQueueModel, StravaToken } from '../types';

const db = admin.firestore();

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

const addIDToQueue = async (id: number): Promise<void> => {
    const docRef = db.collection('admin').doc('stravaQueue');
    try {
        await docRef.update({
            ids: admin.firestore.FieldValue.arrayUnion(id),
        });
    } catch (error) {
        throw new Error(
            `Failed to add id: ${id} from idQueue\n${error.message}`
        );
    }
};

const removeIDFromQueue = async (id: number): Promise<void> => {
    const docRef = db.collection('admin').doc('stravaQueue');
    try {
        await docRef.update({
            ids: admin.firestore.FieldValue.arrayRemove(id),
        });
    } catch (error) {
        throw new Error(
            `Failed to remove id: ${id} from idQueue\n${error.message}`
        );
    }
};

const clearIDQueue = async (): Promise<void> => {
    const docRef = db.collection('admin').doc('stravaQueue');
    try {
        await docRef.update({
            ids: [],
        });
    } catch (error) {
        throw new Error(`Failed to clear idQueue\n${error.message}`);
    }
};

const getIDQueue = async (): Promise<IdQueueModel> => {
    const docRef = await db.collection('admin').doc('stravaQueue').get();
    if (!docRef.exists) throw new Error('IDQueue document not found');
    return docRef;
};

export {
    admin,
    addIDToQueue,
    clearIDQueue,
    getIDQueue,
    getStravaAccessToken,
    saveNewToken,
    removeIDFromQueue,
};
