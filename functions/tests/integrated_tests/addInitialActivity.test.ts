import assert from 'assert';
import admin from 'firebase-admin';
import {
    connectMongoose,
    closeMongoose,
    clearDatabase,
    findStats,
} from '../../src/mongoDB';
import Activity from '../../src/mongoDB/models/activity';
import {
    activityModel,
    initialMonthStat,
    initialOverallStat,
    initialYearStat,
} from '../helpers';
import { TESTING_SERVICE_ACCOUNT } from '../../src/keys.json';
import { ActivityModel, StatModel } from '../../src/types';
import { expect } from 'chai';

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
const testDB = testInstance.firestore();
testDB.settings({ host: 'localhost:8080', ssl: false });
const prodDocRef = db.collection('admin').doc('strava');
const testDocRef = testDB.collection('admin').doc('strava');

describe('Adding new activity to db from webhook test', function () {
    before(async function () {
        const prodData = await prodDocRef.get();
        const stravaDataProd = prodData.data();
        if (!stravaDataProd)
            throw new Error(
                'Unable to retrieve strava data from production db'
            );
        await testDocRef.set(stravaDataProd);
        await connectMongoose();
    });

    describe('idQueue', async function () {
        it('should add new run id to firebase', async function () {
            const idQueueRef = testDB.collection('admin').doc('stravaQueue');
            await idQueueRef.update({
                ids: admin.firestore.FieldValue.arrayUnion(5051241105),
            });
            const idQueueData = await idQueueRef.get();
            const idQueue = idQueueData.data();
            if (!idQueue) throw new Error('idQueue does not exist');
            assert.strictEqual(Array.isArray(idQueue.ids), true);
            const ids = idQueue.ids;
            ids.should.include(5051241105);
        });
    });

    describe('Wait 10sec for process to finish', async function () {
        it('should wait 10sec', async function () {
            // eslint-disable-next-line no-invalid-this
            this.timeout(15000);
            await new Promise((resolve) => setTimeout(resolve, 10000));
        });
    });

    describe('Save activity to db', async function () {
        let activity: ActivityModel;

        it('should save valid activity to db', async function () {
            activity = (await Activity.findOne({
                strava_id: 5051241105,
            })) as ActivityModel;
            expect(activity).not.be.null;
            const errors = activity.validateSync();
            expect(errors).to.be.undefined;
        });

        it('should have correct values', function () {
            activity.should.like(activityModel);
        });
    });

    describe('Save stats to db', async function () {
        let stats: StatModel[] = [];
        let overallStat: StatModel;
        let yearStat: StatModel;
        let monthStat: StatModel;

        it('should save stats to db', async function () {
            stats = (await findStats([
                { stat_id: 0 },
                { stat_id: 202100 },
                { stat_id: 202104 },
            ])) as StatModel[];
            expect(stats).to.not.be.null;
            expect(stats.length).to.equal(3);
        });

        it('should save valid overall stat to db', function () {
            overallStat = stats.find((stat) => stat.stat_id === 0) as StatModel;
            expect(overallStat).to.not.be.undefined;
            const errors = overallStat.validateSync();
            if (errors) console.log(errors.message);
            expect(errors).to.be.undefined;
        });
        it('should have correct values for overall stat', function () {
            overallStat.should.like(initialOverallStat);
        });
        it('should save valid year stat to db', function () {
            yearStat = stats.find(
                (stat) => stat.stat_id === 202100
            ) as StatModel;
            expect(yearStat).to.not.be.undefined;
            const errors = yearStat.validateSync();
            if (errors) console.log(errors.message);
            expect(errors).to.be.undefined;
        });
        it('should have correct values for year stat', function () {
            yearStat.should.like(initialYearStat);
        });
        it('should save valid month stat to db', function () {
            monthStat = stats.find(
                (stat) => stat.stat_id === 202104
            ) as StatModel;
            expect(monthStat).to.not.be.undefined;
            const errors = monthStat.validateSync();
            if (errors) console.log(errors.message);
            expect(errors).to.be.undefined;
        });
        it('should have correct values for month stat', function () {
            monthStat.should.like(initialMonthStat);
        });
    });

    describe('save next activity with same year and month', async function () {
        let stats: StatModel[] = [];
        let overallStat: StatModel;
        let yearStat: StatModel;
        let monthStat: StatModel;

        before(async function () {
            // Save new activity
            // Get stats
        });

        it('should save stats to db', async function () {
            stats = (await findStats([
                { stat_id: 0 },
                { stat_id: 202100 },
                { stat_id: 202104 },
            ])) as StatModel[];
            expect(stats).to.not.be.null;
            expect(stats.length).to.equal(3);
        });

        it('should save valid overall stat to db', function () {
            overallStat = stats.find((stat) => stat.stat_id === 0) as StatModel;
            expect(overallStat).to.not.be.undefined;
            const errors = overallStat.validateSync();
            if (errors) console.log(errors.message);
            expect(errors).to.be.undefined;
        });
        it('should have correct values for overall stat', function () {
            overallStat.should.like(initialOverallStat);
        });
        it('should save valid year stat to db', function () {
            yearStat = stats.find(
                (stat) => stat.stat_id === 202100
            ) as StatModel;
            expect(yearStat).to.not.be.undefined;
            const errors = yearStat.validateSync();
            if (errors) console.log(errors.message);
            expect(errors).to.be.undefined;
        });
        it('should have correct values for year stat', function () {
            yearStat.should.like(initialYearStat);
        });
        it('should save valid month stat to db', function () {
            monthStat = stats.find(
                (stat) => stat.stat_id === 202104
            ) as StatModel;
            expect(monthStat).to.not.be.undefined;
            const errors = monthStat.validateSync();
            if (errors) console.log(errors.message);
            expect(errors).to.be.undefined;
        });
        it('should have correct values for month stat', function () {
            monthStat.should.like(initialMonthStat);
        });
    });

    after(async function () {
        const testDBData = await testDocRef.get();
        const stravaDataTest = testDBData.data();
        if (!stravaDataTest)
            throw new Error('Unable to retrieve strava data from emulator db');
        await prodDocRef.set(stravaDataTest);
        await clearDatabase();
        await closeMongoose();
    });
});
