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
            test_activity_1,
            test_activity_2,
            test_activity_3,
        } = rawActivities;
        const activities = [
            test_activity_1,
            test_activity_2,
            test_activity_3,
        ].map((act) => new Activity(act));
        stats = calcStats(activities, null);
    });

    it('should return array of length 3', function () {
        stats.forEach((stat) => console.log(stat));
        const result = findUniqueIds(stats);
        expect(stats.length).to.equal(3);
    });
});
