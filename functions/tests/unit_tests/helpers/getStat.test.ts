import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import * as queries from '../../../src/mongoDB/queries';
import Stat from '../../../src/mongoDB/models/stat';
import getStat from '../../../src/helpers/getStat';
import { StatModel } from '../../../src/types';
import { ApolloError } from 'apollo-server-errors';

describe('(helpers) getStat', function () {
    let sandbox: SinonSandbox;
    let mongoDBStub: SinonStub;
    let stat: StatModel;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        stat = new Stat();
        mongoDBStub = sandbox.stub(queries, 'findStat').resolves(stat);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call findStat once', async function () {
        await getStat({ year: 2021, month: 1 });
        mongoDBStub.should.have.been.calledOnce;
    });
    it('should return a stat', async function () {
        const result = await getStat({ year: 2021, month: 1 });
        expect(result).to.be.an.instanceof(Stat);
    });
    it('should return null if findStat returns null', async function () {
        mongoDBStub.resolves(null);
        const result = await getStat({ year: 2021, month: 1 });
        expect(result).null;
    });
    it('should throw an error if month argument is > 0 and year argument is 0', async function () {
        try {
            await getStat({ month: 1, year: 0 });
        } catch (error) {
            expect(error.message).to.equal('Error: year required with month');
            expect(error).to.be.an.instanceof(ApolloError);
        }
    });
});
