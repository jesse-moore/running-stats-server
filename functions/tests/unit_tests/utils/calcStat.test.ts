import sinon from 'sinon';
import { expect } from 'chai';
import calcStats, { calculateBaseStat } from '../../../src/utils/calcStats';
import Activity from '../../../src/mongoDB/models/activity';
import Stat from '../../../src/mongoDB/models/stat';
import { rawActivities } from '../../data';
import { ActivityModel, StatModel } from '../../../src/types';

describe('Add Initial Activity to Empty Database', function () {
    let activity: ActivityModel;
    let overallStat: StatModel;
    let yearStat: StatModel;
    let monthStat: StatModel;
    before(function () {
        activity = new Activity(rawActivities.activity_04_07_2021);
        console.log(activity);
    });
    it('should create overall, year and month stat', function () {
        const stats = calcStats([activity], null);
        expect(stats.length).to.equal(3);
        stats.forEach((stat) => {
            if (stat.year === null && stat.month == null) overallStat = stat;
            if (stat.year !== null && stat.month === null) yearStat = stat;
            if (stat.year !== null && stat.month !== null) monthStat = stat;
        });
        expect(overallStat).to.not.be.undefined;
        expect(yearStat).to.not.be.undefined;
        expect(monthStat).to.not.be.undefined;
    });

    it('should add base stats', function () {
        const stat: StatModel = new Stat();
        calculateBaseStat(stat, activity);
        console.log(stat);
        expect(stat.count).equal(1);
        expect(stat.total_distance).equal(8494.7);
        expect(stat.average_distance).equal(8494.7);
        expect(stat.total_elev_gain).equal(63.9);
        expect(stat.average_elev_gain).equal(63.9);
        expect(stat.total_moving_time).equal(2576);
        expect(stat.average_moving_time).equal(2576);
        expect(stat.average_speed).equal(3.3);
        expect(stat.daysOfWeek).to.like({
            mo: 0,
            tu: 0,
            we: 1,
            th: 0,
            fr: 0,
            sa: 0,
            su: 0,
        });
        expect(stat.periodOfDay).to.like({
            earlyMorning: 0,
            morning: 0,
            afternoon: 1,
            evening: 0,
            night: 0,
        });
    });

    it('should have "night:1"', function () {
        const stat: StatModel = new Stat();
        activity.start_date_local = '2021-04-07T02:19:38.000+00:00';
        calculateBaseStat(stat, activity);
        expect(stat.periodOfDay).to.like({
            earlyMorning: 0,
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 1,
        });
    });
    it('should have "earlyMorning:1"', function () {
        const stat: StatModel = new Stat();
        activity.start_date_local = '2021-04-07T04:19:38.000+00:00';
        calculateBaseStat(stat, activity);
        expect(stat.periodOfDay).to.like({
            earlyMorning: 1,
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 0,
        });
    });
    it('should have "morning:1"', function () {
        const stat: StatModel = new Stat();
        activity.start_date_local = '2021-04-07T09:19:38.000+00:00';
        calculateBaseStat(stat, activity);
        expect(stat.periodOfDay).to.like({
            earlyMorning: 0,
            morning: 1,
            afternoon: 0,
            evening: 0,
            night: 0,
        });
    });
    it('should have "evening:1"', function () {
        const stat: StatModel = new Stat();
        activity.start_date_local = '2021-04-07T19:19:38.000+00:00';
        calculateBaseStat(stat, activity);
        expect(stat.periodOfDay).to.like({
            earlyMorning: 0,
            morning: 0,
            afternoon: 0,
            evening: 1,
            night: 0,
        });
    });
    it('should have "night:1"', function () {
        const stat: StatModel = new Stat();
        activity.start_date_local = '2021-04-07T23:19:38.000+00:00';
        calculateBaseStat(stat, activity);
        expect(stat.periodOfDay).to.like({
            earlyMorning: 0,
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 1,
        });
    });
});
