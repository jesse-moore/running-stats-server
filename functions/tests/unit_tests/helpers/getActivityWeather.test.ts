import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import axios from 'axios';
import { weather_data, weather_data_invalid } from '../../data/responses';
import getActivityWeather from '../../../src/helpers/getActivityWeather';
import Activity from '../../../src/mongoDB/models/activity';
import { rawActivities } from '../../data';
import { ActivityModel } from '../../../src/types';

describe('', function () {
    let sandbox: SinonSandbox;
    let activity: ActivityModel;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return null if parsing activity fails', async function () {
        activity = new Activity(rawActivities.activity_missing_latlng);
        const result = await getActivityWeather(activity);
        expect(result).null;
    });
    it('should return null if fetching weather fails', async function () {
        sandbox.stub(axios, 'get').resolves(Promise.reject());
        activity = new Activity(rawActivities.activity_03_28_2021);
        const result = await getActivityWeather(activity);
        expect(result).null;
    });
    it('should return null if parsing weather fails', async function () {
        sandbox.stub(axios, 'get').resolves(Promise.resolve({ data: {} }));
        activity = new Activity(rawActivities.activity_03_28_2021);
        const result = await getActivityWeather(activity);
        expect(result).null;
    });
    it('should return null if validating weather fails', async function () {
        sandbox
            .stub(axios, 'get')
            .resolves(Promise.resolve({ data: weather_data_invalid }));
        activity = new Activity(rawActivities.activity_03_28_2021);
        const result = await getActivityWeather(activity);
        expect(result).null;
    });
    it('should return weather object', async function () {
        sandbox
            .stub(axios, 'get')
            .resolves(Promise.resolve({ data: weather_data }));
        activity = new Activity(rawActivities.activity_03_28_2021);
        const result = await getActivityWeather(activity);
        expect(result).to.not.undefined;
    });
});
