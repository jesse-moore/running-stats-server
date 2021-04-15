import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import * as queries from '../../../src/mongoDB/queries';
import { getActivityByID } from '../../../src/helpers';
import { ApolloError } from 'apollo-server-errors';
import Activity from '../../../src/mongoDB/models/activity';
import { ActivityModel } from '../../../src/types';

describe('(helpers) getActivities', function () {
    let sandbox: SinonSandbox;
    let mongoDBStub: SinonStub;
    let activity: ActivityModel;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        activity = new Activity();
        mongoDBStub = sandbox
            .stub(queries, 'findActivityByID')
            .resolves(activity);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call findActivities once', async function () {
        await getActivityByID({ id: '1234' });
        mongoDBStub.should.have.been.calledOnce;
    });
    it('should call findActivities with correct arguments', async function () {
        await getActivityByID({ id: '1234' });
        mongoDBStub.should.have.been.calledWith('1234');
    });
    it('should return an activity', async function () {
        const result = await getActivityByID({ id: '1234' });
        expect(result).to.be.instanceOf(Activity);
    });
    it('should throw an ApolloError if findActivities is rejected', async function () {
        mongoDBStub.rejects({ message: 'test error' });
        try {
            await getActivityByID({ id: '1234' });
        } catch (error) {
            expect(error).to.be.instanceOf(ApolloError);
        }
    });
});
