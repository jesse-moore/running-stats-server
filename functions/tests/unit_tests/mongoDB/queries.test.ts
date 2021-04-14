import { expect } from 'chai';
import sinon, { SinonSandbox, SinonSpy, SinonStub } from 'sinon';
import * as response from '../../data/responses';
import {
    clearDatabase,
    findActivities,
    findActivitiesById,
    findActivityByID,
    findAvailableStats,
    findStat,
    findStats,
    getIndexSet,
} from '../../../src/mongoDB/queries';
import Activity from '../../../src/mongoDB/models/activity';
import Stat from '../../../src/mongoDB/models/stat';

describe('(mongoDB - queries)', function () {
    let sandbox: SinonSandbox;
    let activityDeleteManyStub: SinonStub;
    let statDeleteManyStub: SinonStub;
    let activityFindByIdStub: SinonStub;
    let activityDistinctStub: SinonStub;
    let activityFindStub: SinonStub;
    let StatFindOneStub: SinonStub;
    let StatFindStub: SinonStub;
    let StatAggregateStub: SinonStub;
    let skipFake: SinonSpy;
    let sortFake: SinonSpy;
    let limitFake: SinonSpy;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        activityDeleteManyStub = sandbox.stub(Activity, 'deleteMany');
        statDeleteManyStub = sandbox.stub(Stat, 'deleteMany');
        activityFindByIdStub = sandbox.stub(Activity, 'findById');
        activityDistinctStub = sandbox.stub(Activity, 'distinct');
        activityFindStub = sandbox.stub(Activity, 'find');
        StatFindStub = sandbox.stub(Stat, 'find');
        StatFindOneStub = sandbox.stub(Stat, 'findOne');
        StatAggregateStub = sandbox.stub(Stat, 'aggregate');
        sortFake = sandbox.fake();
        skipFake = sandbox.fake();
        limitFake = sandbox.fake();
        activityFindStub.returns({
            sort: function (arg: any) {
                sortFake(arg);
                return this;
            },
            skip: function (arg: any) {
                skipFake(arg);
                return this;
            },
            limit: function (arg: any) {
                limitFake(arg);
                return this;
            },
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('clearDatabase', function () {
        it('should call Activity.deleteMany() and Stat.deleteMany() once', async function () {
            await clearDatabase();
            activityDeleteManyStub.should.have.calledOnce;
            statDeleteManyStub.should.have.calledOnce;
        });
        it('should throw error if Activity.deleteMany() or Stat.deleteMany() is rejected', async function () {
            activityDeleteManyStub.resolves(
                Promise.reject({ message: 'test message' })
            );
            try {
                await clearDatabase();
            } catch (error) {
                expect(error.message).equals('test message');
            }
        });
    });
    describe('findActivityByID', function () {
        it('should call Activity.findActivityById() once', async function () {
            await findActivityByID('1234');
            activityFindByIdStub.should.have.calledOnce;
        });
        it('should call Activity.findActivityById() with argument "1234"', async function () {
            await findActivityByID('1234');
            activityFindByIdStub.should.have.been.calledWith('1234');
        });
        it('should throw error if Activity.findActivityById() is rejected', async function () {
            activityFindByIdStub.rejects({ message: 'test message' });
            try {
                await findActivityByID('1234');
            } catch (error) {
                expect(error.message).equals('test message');
            }
        });
        it('should throw error if Activity.findActivityById() is rejected with error.name === "CastError"', async function () {
            activityFindByIdStub.rejects({ name: 'CastError' });
            try {
                await findActivityByID('1234');
            } catch (error) {
                expect(error.message).equals('Invalid ID');
            }
        });
    });
    describe('getIndexSet', function () {
        it('should call Activity.distinct once', async function () {
            activityDistinctStub.resolves([]);
            await getIndexSet();
            activityDistinctStub.should.have.been.calledOnce;
        });
        it('should return a Set', async function () {
            activityDistinctStub.resolves([]);
            const result = await getIndexSet();
            expect(result instanceof Set).true;
        });
        it('should throw error if Activity.distinct does not return an array', async function () {
            activityDistinctStub.resolves();
            try {
                await getIndexSet();
            } catch (error) {
                expect(error.message).to.equal('Failed to get index');
            }
        });
    });
    describe('findActivities', function () {
        it('should call Activity.find once', async function () {
            await findActivities({});
        });
        it('should call Activity.find with correct arguments', async function () {
            await findActivities({
                year: 2021,
                month: 1,
                page: 0,
                perPage: 30,
            });
            activityFindStub.calledOnceWith({
                year: 2021,
                month: 1,
                page: 0,
                perPage: 30,
            });
        });
        it('should call Activity.find with correct default arguments', async function () {
            await findActivities({
                year: 2021,
                month: 1,
            });
            activityFindStub.calledOnceWith({
                year: 2021,
                month: 1,
                page: 0,
                perPage: 0,
            });
        });
        it('should call Activity.find().sort() with correct arguments', async function () {
            await findActivities({
                year: 2021,
                month: 1,
            });
            sortFake.should.have.been.calledWith({ start_date_local: -1 });
        });
        it('should call Activity.find().skip() with correct arguments', async function () {
            await findActivities({
                year: 2021,
                month: 1,
            });
            skipFake.should.have.been.calledWith(0);
        });
        it('should call Activity.find().limit() with correct arguments', async function () {
            await findActivities({
                year: 2021,
                month: 1,
            });
            limitFake.should.have.been.calledWith(0);
        });
        it('should throw error if Activity.find() is rejected', async function () {
            activityFindStub.returns({
                sort: sinon.stub().returnsThis(),
                skip: sinon.stub().returnsThis(),
                limit: sinon
                    .stub()
                    .returns(Promise.reject({ message: 'test error' })),
            });
            try {
                await findActivities({
                    year: 2021,
                    month: 1,
                });
            } catch (error) {
                expect(error.message).to.equal('test error');
            }
        });
    });
    describe('findActivitiesById', function () {
        it('should call Activity.find once', async function () {
            await findActivitiesById({ ids: [] });
            activityFindStub.should.have.been.calledOnce;
        });
        it('should call Activity.find with correct arguments', async function () {
            await findActivitiesById({ ids: [], projection: { name: 1 } });
            activityFindStub.should.have.been.calledWithExactly(
                { $or: [] },
                { name: 1 }
            );
        });
        it('should map id arguments correctly', async function () {
            await findActivitiesById({
                ids: ['1234', '5678'],
                projection: { name: 1 },
            });
            activityFindStub.should.have.been.calledWithExactly(
                { $or: [{ _id: '1234' }, { _id: '5678' }] },
                { name: 1 }
            );
        });
        it('should return array', async function () {
            activityFindStub.resolves([]);
            const result = await findActivitiesById({ ids: [] });
            expect(Array.isArray(result)).true;
        });
        it('should throw error if Activity.find is rejected', async function () {
            activityFindStub.rejects({ message: 'test error' });
            try {
                await findActivitiesById({ ids: [] });
            } catch (error) {
                expect(error.message).to.equal('test error');
            }
        });
    });
    describe('findStat', function () {
        it('should call Stat.findOne once', async function () {
            await findStat(1234);
            StatFindOneStub.should.have.been.calledOnce;
        });
        it('should call Stat.findOne with correct arguments', async function () {
            await findStat(1234);
            StatFindOneStub.should.have.been.calledWith({ stat_id: 1234 });
        });
        it('should call Stat.findOne with correct arguments', async function () {
            await findStat(1234);
            StatFindOneStub.should.have.been.calledWith({ stat_id: 1234 });
        });
        it('should return array', async function () {
            StatFindOneStub.resolves([]);
            const result = await findStat(1234);
            expect(Array.isArray(result)).true;
        });
        it('should throw error if Stat.findOne is rejected', async function () {
            StatFindOneStub.rejects({ message: 'test error' });
            try {
                await findStat(1234);
            } catch (error) {
                expect(error.message).to.equal('test error');
            }
        });
    });
    describe('findStats', function () {
        it('should call Stat.find once', async function () {
            await findStats([]);
            StatFindStub.should.have.been.calledOnce;
        });
        it('should call Stat.find with correct arguments', async function () {
            await findStats([{ stat_id: 1234 }]);
            StatFindStub.should.have.been.calledWith({
                $or: [{ stat_id: 1234 }],
            });
        });
        it('should throw error if Stat.findOne is rejected', async function () {
            StatFindStub.rejects({ message: 'test error' });
            try {
                await findStats([]);
            } catch (error) {
                expect(error.message).to.equal('test error');
            }
        });
    });
    describe('findAvailableStats', function () {
        it('should call Stat.aggregate once', async function () {
            await findAvailableStats();
            StatAggregateStub.should.have.been.calledOnce;
        });
        it('should throw error if Stat.findOne is rejected', async function () {
            StatAggregateStub.rejects({ message: 'test error' });
            try {
                await findAvailableStats();
            } catch (error) {
                expect(error.message).to.equal('test error');
            }
        });
    });
});
