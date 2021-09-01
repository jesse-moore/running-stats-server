import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { weatherData, rawActivities } from '../../data/';
import getNewActivities from '../../../src/helpers/getNewActivities';
import Activity from '../../../src/mongoDB/models/activity';
import * as strava from '../../../src/strava';
import * as helpers from '../../../src/helpers';
import { ActivityModel } from '../../../src/types';

describe('(helpers) getNewActivities', function () {
    let sandbox: SinonSandbox;
    let getStravaAccessTokenStub: SinonStub;
    let getNewActivityStub: SinonStub;
    let getActivityLocationStub: SinonStub;
    let getActivityWeatherStub: SinonStub;
    let activity: ActivityModel;
    let activity2: ActivityModel;

    before(() => {
        activity = new Activity(rawActivities.test_activity_1);
        activity2 = new Activity(rawActivities.test_activity_2);
    });

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        getStravaAccessTokenStub = sandbox
            .stub(strava, 'getStravaAccessToken')
            .resolves('token');
        getNewActivityStub = sandbox
            .stub(helpers, 'getNewActivity')
            .onFirstCall()
            .resolves(activity)
            .onSecondCall()
            .resolves(activity2);
        getActivityLocationStub = sandbox
            .stub(helpers, 'getActivityLocation')
            .resolves({
                state: 'Arkansas',
                country: 'United States',
                country_code: 'us',
                city: 'test',
            });
        getActivityWeatherStub = sandbox
            .stub(helpers, 'getActivityWeather')
            .resolves(weatherData.formattedWeather);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call getStravaAccessToken once', async function () {
        await getNewActivities([1234, 4567]);
        getStravaAccessTokenStub.should.have.been.calledOnce;
    });
    it('should call getNewActivity for each activity in input array', async function () {
        await getNewActivities([1234, 4567]);
        getNewActivityStub.should.have.been.calledTwice;
    });
    it('should call getActivityLocation for each activity in input array', async function () {
        await getNewActivities([1234, 4567]);
        getActivityLocationStub.should.have.been.calledTwice;
    });
    it('should call getActivityWeather for each activity in input array', async function () {
        await getNewActivities([1234, 4567]);
        getActivityWeatherStub.should.have.been.calledTwice;
    });
    it('should not call getActivityLocation or getActivityWeather if activity cannot be fetched', async function () {
        getNewActivityStub.onSecondCall().resolves(null);
        await getNewActivities([1234, 4567]);
        getActivityLocationStub.should.have.been.calledOnce;
        getActivityWeatherStub.should.have.been.calledOnce;
    });
    it('should not add activity to returned array if it fails validation', async function () {
        sandbox
            .stub(activity, 'validateSync')
            .onSecondCall()
            .returns({ message: 'test error message', name: 'test error' });

        const result = await getNewActivities([1234, 4567]);
        expect(result.length).to.equal(1);
        expect(result[0].name).to.equal('test_activity_1');
    });
});
