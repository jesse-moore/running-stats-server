import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import * as queries from '../../../src/mongoDB/queries';
import { getActivities } from '../../../src/helpers';
import { ApolloError } from 'apollo-server-errors';

describe('(helpers) getActivities', function () {
    let sandbox: SinonSandbox;
    let mongoDBStub: SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        mongoDBStub = sandbox.stub(queries, 'findActivities').resolves([]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call findActivities once', async function () {
        await getActivities({});
        mongoDBStub.should.have.been.calledOnce;
    });
    it('should call findActivities with correct arguments', async function () {
        await getActivities({ year: 2021, month: 1, page: 0, perPage: 30 });
        mongoDBStub.should.have.been.calledWith({
            year: 2021,
            month: 1,
            page: 0,
            perPage: 30,
        });
    });
    it('should return an array', async function () {
        const result = await getActivities({});
        expect(Array.isArray(result)).true;
    });
    it('should throw an ApolloError if findActivities is rejected', async function () {
        mongoDBStub.rejects({ message: 'test error' });
        try {
            await getActivities({ year: 2021, month: 1, page: 0, perPage: 30 });
        } catch (error) {
            expect(error).to.be.instanceOf(ApolloError);
        }
    });
});
