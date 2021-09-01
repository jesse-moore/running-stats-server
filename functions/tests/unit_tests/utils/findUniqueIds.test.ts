import { expect } from 'chai';
import { testStats } from '../../data';
import { StatModel } from '../../../src/types';
import Stat from '../../../src/mongoDB/models/stat';
import findUniqueIds from '../../../src/utils/findUniqueIds';

describe('(utils) - findUniqueIds', function () {
    let stat_all = new Stat(testStats.test_stat_all);
    let stat_year = new Stat(testStats.test_stat_year);
    let stat_month = new Stat(testStats.test_stat_month);
    let stats: StatModel[] = [stat_all, stat_month, stat_year];

    it('should return array of length 57', function () {
        const result = findUniqueIds(stats);
        expect(result.length).to.equal(57);
    });
    it('should return empty array if given no stat models', function () {
        const result = findUniqueIds([]);
        expect(result.length).to.equal(0);
    });
    it('should return an array of ids of type string', function () {
        const result = findUniqueIds(stats);
        result.forEach((id) => {
            expect(typeof id).to.equal('string');
        });
    });
    it('should return an array of unique ids', function () {
        const result = findUniqueIds(stats);
        const idsSet = new Set(result);
        expect(result.length).to.equal(idsSet.size);
    });
});
