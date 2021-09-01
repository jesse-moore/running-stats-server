import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import * as queries from '../../../src/mongoDB/queries';
import Stat from '../../../src/mongoDB/models/stat';
import getStats from '../../../src/helpers/getStats';
import { StatModel } from '../../../src/types';
import { ApolloError } from 'apollo-server-errors';

describe('(helpers) getStat', function () {
    let sandbox: SinonSandbox;
    let mongoDBStub: SinonStub;
    let stat: StatModel;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        stat = new Stat();
        mongoDBStub = sandbox.stub(queries, 'findStats').resolves([stat]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call findStats once', async function () {
        await getStats([{ year: 2021, month: 1 }]);
        mongoDBStub.should.have.been.calledOnce;
    });
    it('should return an array of stats', async function () {
        const result = await getStats([{ year: 2021, month: 1 }]);
        result?.forEach((stat) => {
            expect(stat).to.be.an.instanceof(Stat);
        });
    });
    it('should throw an error if month argument is > 0 and year argument is 0', async function () {
        try {
            await getStats([{ month: 1, year: 0 }]);
        } catch (error) {
            expect(error.message).to.equal('Error: year required with month');
            expect(error).to.be.an.instanceof(ApolloError);
        }
    });
});
