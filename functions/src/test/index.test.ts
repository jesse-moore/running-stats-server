import assert from 'assert';
import admin from 'firebase-admin';
import { connectMongoose, closeMongoose, clearDatabase } from '../mongoDB';
import { TESTING_SERVICE_ACCOUNT } from '../keys.json';
import test from 'firebase-functions-test';
// const test = require()();
const firebaseTest = test();
admin.initializeApp({
    credential: admin.credential.cert(
        TESTING_SERVICE_ACCOUNT as admin.ServiceAccount
    ),
});

const testInstance = admin.initializeApp(
    {
        credential: admin.credential.cert(
            TESTING_SERVICE_ACCOUNT as admin.ServiceAccount
        ),
    },
    'testing'
);

const db = admin.firestore();
// firebase.functions().useEmulator("localhost", 5001);
const testDB = testInstance.firestore();
testDB.settings({ host: 'localhost:8080', ssl: false });
const prodDocRef = db.collection('admin').doc('strava');
const testDocRef = testDB.collection('admin').doc('strava');

describe('Array', function () {
    before(async function () {
        const prodData = await prodDocRef.get();
        const stravaDataProd = prodData.data();
        if (!stravaDataProd)
            throw new Error(
                'Unable to retrieve strava data from production db'
            );
        await testDocRef.set(stravaDataProd);
        await clearDB();
    });

    describe('#indexOf()', async function () {
        it('should add new run to db and recalculate stats', async function () {
            const idQueueRef = testDB.collection('admin').doc('stravaQueue');
            await idQueueRef.update({
                ids: admin.firestore.FieldValue.arrayUnion(5051241105),
            });
            assert.strictEqual([1, 2, 3].indexOf(4), -1);
        });
    });

    describe('#indexOf()2', function () {
        it('should return -1 when the value is not present', async function () {
            assert.strictEqual([1, 2, 3].indexOf(4), -1);
        });
    });

    after(async function () {
        const testData = await testDocRef.get();
        const stravaDataTest = testData.data();
        if (!stravaDataTest)
            throw new Error('Unable to retrieve strava data from emulator db');
        await prodDocRef.set(stravaDataTest);
    });
});

async function clearDB() {
    await connectMongoose();
    await clearDatabase();
    await closeMongoose();
}
