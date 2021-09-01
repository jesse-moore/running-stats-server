import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import * as strava from '../../../src/strava';
import Activity from '../../../src/mongoDB/models/activity';
import { getNewActivity } from '../../../src/helpers';
import { rawActivities } from '../../data';

describe('(helpers) getActivities', function () {
    let sandbox: SinonSandbox;
    let stravaStub: SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        stravaStub = sandbox
            .stub(strava, 'fetchActivityFromStrava')
            .resolves(rawActivities.test_activity_1);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call findActivities once', async function () {
        await getNewActivity(1234, 'token');
        stravaStub.should.have.been.calledOnce;
    });
    it('should call findActivities with correct arguments', async function () {
        await getNewActivity(1234, 'token');
        stravaStub.should.have.been.calledWith('token', 1234);
    });
    it('should return an activity', async function () {
        const result = await getNewActivity(1234, 'token');
        expect(result).is.instanceOf(Activity);
    });
    it('should set strava_id to id', async function () {
        const result = await getNewActivity(1234, 'token');
        expect(result?.strava_id).to.equal(rawActivities.test_activity_1.id);
    });
    it('should parse best efforts correctly', async function () {
        const result = await getNewActivity(1234, 'token');
        expect(result?.toObject().best_efforts).to.deep.equal([
            {
                name: '400m',
                start_index: 169,
                end_index: 266,
                elapsed_time: 107,
                distance: 400,
            },
            {
                name: '1/2 mile',
                start_index: 942,
                end_index: 1134,
                elapsed_time: 223,
                distance: 805,
            },
            {
                name: '1k',
                start_index: 942,
                end_index: 1184,
                elapsed_time: 281,
                distance: 1000,
            },
            {
                name: '1 mile',
                start_index: 941,
                end_index: 1339,
                elapsed_time: 466,
                distance: 1609,
            },
            {
                name: '2 mile',
                start_index: 8,
                end_index: 838,
                elapsed_time: 959,
                distance: 3219,
            },
            {
                name: '5k',
                start_index: 44,
                end_index: 1335,
                elapsed_time: 1493,
                distance: 5000,
            },
        ]);
    });
    it('should return null if fetchActivityFromStrava returns null', async function () {
        stravaStub.resolves(null);
        const result = await getNewActivity(1234, 'token');
        expect(result).null;
    });
    it('should set best_efforts property to null if activity does not have best efforts', async function () {
        const testActivity = Object.assign({}, rawActivities.test_activity_1);
        //@ts-ignore
        delete testActivity.best_efforts;
        stravaStub.resolves(testActivity);
        const result = await getNewActivity(1234, 'token');
        expect(result?.best_efforts).null;
    });
});
