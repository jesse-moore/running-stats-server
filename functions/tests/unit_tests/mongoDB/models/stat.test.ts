import { expect } from 'chai';
import { Model, models } from 'mongoose';
import Stat from '../../../../src/mongoDB/models/stat';
import { testStats } from '../../../data';

describe('(mongoDB) Stat model', function () {
    let test_stat = testStats.test_stat_all;

    it('should create new Stat model', function () {
        const stat = new Stat(test_stat);
        expect(stat).to.be.instanceOf(Model);
    });
    it('should change _id to id and remove _v when toJSON method called', function () {
        const stat = new Stat(test_stat);
        const statJSON = stat.toJSON();
        expect(statJSON._v).undefined;
        expect(statJSON._id).undefined;
        expect(typeof statJSON.id).to.be.equal('string');
    });
    it("shoud create add Stat model to models if it doesn't exist", async function () {
        delete models.Stat;
        const stat = new Stat(test_stat);
        expect(stat).to.be.instanceOf(Model);
    });
});
