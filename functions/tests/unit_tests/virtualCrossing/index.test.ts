import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import axios from 'axios';
import fetchWeather from '../../../src/virtualCrossing/index';
import { parseActivity } from '../../../src/helpers/getActivityWeather';
import Activity from '../../../src/mongoDB/models/activity';
import { rawActivities } from '../../data';
import { ActivityModel } from '../../../src/types';

describe('fetchWeather', function () {
    let sandbox: SinonSandbox;
    let activity: ActivityModel;
    let parsedActivity: any;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        activity = new Activity(rawActivities.test_activity_1);
        parsedActivity = parseActivity(activity);
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('should return correct data', async function () {
        sandbox.stub(axios, 'get').resolves(Promise.resolve({ data: 'data' }));
        const data = await fetchWeather(parsedActivity);
        expect(data).to.equal('data');
    });
    it('should return null if fetch is rejected', async function () {
        sandbox.stub(axios, 'get').resolves(Promise.reject({}));
        const data = await fetchWeather(parsedActivity);
        expect(data).null;
    });
});
