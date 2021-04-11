import { expect } from 'chai';
import findUniqueIds from '../../../src/utils/findUniqueIds';
import calcStats from '../../../src/utils/calcStats';
import { rawActivities } from '../../data';
import Activity from '../../../src/mongoDB/models/activity';
import { StatModel } from '../../../src/types';

describe.skip('makeStatID', function () {
    let stats: StatModel[] = [];
    beforeEach(() => {
        const {
            activity_04_01_2021,
            activity_04_05_2021,
            activity_04_07_2021,
        } = rawActivities;
        const activities = [
            activity_04_01_2021,
            activity_04_05_2021,
            activity_04_07_2021,
        ].map((act) => new Activity(act));
        stats = calcStats(activities, null);
    });

    it('should return array of length 3', function () {
        stats.forEach((stat) => console.log(stat));
        const result = findUniqueIds(stats);
        expect(stats.length).to.equal(3);
    });
});
