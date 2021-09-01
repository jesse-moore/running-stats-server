import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import * as queries from '../../../src/mongoDB/queries';
import * as utils from '../../../src/utils';
import updateStats, {
    getUniqueTopActivityIds,
    getTopActivitiesMetrics,
} from '../../../src/helpers/updateStats';
import { ActivityModel, StatModel } from '../../../src/types';
import Activity from '../../../src/mongoDB/models/activity';
import Stat from '../../../src/mongoDB/models/stat';
import { rawActivities, testStats } from '../../data';

describe('', function () {
    let sandbox: SinonSandbox;
    let findStatsStub: SinonStub;
    let findActivitiesByIdStub: SinonStub;
    let calcStatsStub: SinonStub;
    let activity: ActivityModel;
    let activity2: ActivityModel;
    let stat_all: StatModel;
    let stat_year: StatModel;
    let stat_month: StatModel;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        findActivitiesByIdStub = sandbox
            .stub(queries, 'findActivitiesById')
            .resolves([]);
        calcStatsStub = sandbox.stub(utils, 'calcStats');
        activity = new Activity(rawActivities.test_activity_3);
        activity2 = new Activity(rawActivities.test_activity_4);
        stat_all = new Stat(testStats.test_stat_all);
        stat_year = new Stat(testStats.test_stat_year);
        stat_month = new Stat(testStats.test_stat_month);
        findStatsStub = sandbox
            .stub(queries, 'findStats')
            .resolves([stat_all, stat_year, stat_month]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call findStats once', async function () {
        await updateStats([activity, activity2]);
        findStatsStub.should.have.been.calledOnce;
    });
    it('should not call findStats if given an empty array', async function () {
        await updateStats([]);
        findStatsStub.should.not.have.been.called;
    });
    it('should return empty array if given empty array', async function () {
        const result = await updateStats([]);
        expect(result.length).to.equal(0);
    });
    it('should throw error if a promise is rejected', async function () {
        findStatsStub.rejects();
        try {
            await updateStats([activity, activity2]);
        } catch (error) {
            expect(error).to.be.instanceOf(Error);
        }
    });
    it('should call findActivitiesById once', async function () {
        await updateStats([activity, activity2]);
        findActivitiesByIdStub.should.have.been.calledOnce;
    });
    it('should return empty Map if argument given to getUniqueTopActivityIds is null', async function () {
        const result = await getTopActivitiesMetrics(null);
        expect(result).to.be.instanceOf(Map);
        expect(result.size).to.equal(0);
    });
    it('should return a Map size of 2', async function () {
        findActivitiesByIdStub.resolves([activity, activity2]);
        const result = await getTopActivitiesMetrics([
            stat_all,
            stat_month,
            stat_year,
        ]);
        expect(result).to.be.instanceOf(Map);
        expect(result.size).to.equal(2);
    });
});
