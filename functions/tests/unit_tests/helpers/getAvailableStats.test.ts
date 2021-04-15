import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import * as queries from '../../../src/mongoDB/queries';
import { getAvailableStats } from '../../../src/helpers';
import { ApolloError } from 'apollo-server-errors';

describe('(helpers) getActivities', function () {
    let sandbox: SinonSandbox;
    let mongoDBStub: SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        mongoDBStub = sandbox
            .stub(queries, 'findAvailableStats')
            .resolves([{ result: { test: ['test'] } }]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call findAvailableStats once', async function () {
        await getAvailableStats();
        mongoDBStub.should.have.been.calledOnce;
    });
    it('should return an array', async function () {
        const result = await getAvailableStats();
        expect(Array.isArray(result.test)).true;
    });
    it('should throw an ApolloError if findAvailableStats is rejected', async function () {
        mongoDBStub.rejects({ message: 'test error' });
        try {
            await getAvailableStats();
        } catch (error) {
            expect(error).to.be.instanceOf(ApolloError);
        }
    });
});
