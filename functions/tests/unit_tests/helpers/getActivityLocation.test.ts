import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import axios from 'axios';
import getActivityLocation from '../../../src/helpers/getActivityLocation';
import Activity from '../../../src/mongoDB/models/activity';
import { rawActivities } from '../../data';
import * as response from '../../data/responses';
import { ActivityModel } from '../../../src/types';

describe('', function () {
    let sandbox: SinonSandbox;
    let activity: ActivityModel;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        activity = new Activity(rawActivities.test_activity_1);
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('should return null if fetch is rejected', async function () {
        sandbox.stub(axios, 'get').resolves(Promise.reject());
        const data = await getActivityLocation(activity);
        expect(data).null;
    });
    it('should return null if location is null', async function () {
        sandbox.stub(axios, 'get').resolves(Promise.resolve({ data: null }));
        const data = await getActivityLocation(activity);
        expect(data).null;
    });
    it('should return null if location exists but has no address property', async function () {
        sandbox
            .stub(axios, 'get')
            .resolves(Promise.resolve({ data: { location: {} } }));
        const data = await getActivityLocation(activity);
        expect(data).null;
    });
    it('should return correct data for standard location', async function () {
        sandbox
            .stub(axios, 'get')
            .resolves(Promise.resolve({ data: response.geoCode }));
        const data = await getActivityLocation(activity);
        expect(data).to.deep.equal({
            state: 'Arkansas',
            country: 'United States',
            country_code: 'us',
            city: 'Springdale',
        });
    });
    it('should return correct data is city property is city_district', async function () {
        sandbox
            .stub(axios, 'get')
            .resolves(
                Promise.resolve({ data: response.geoCode_city_district })
            );
        const data = await getActivityLocation(activity);
        expect(data).to.deep.equal({
            state: 'Arkansas',
            country: 'United States',
            country_code: 'us',
            city: 'test',
        });
    });
    it('should return correct data is city property is hamlet', async function () {
        sandbox
            .stub(axios, 'get')
            .resolves(Promise.resolve({ data: response.geoCode_hamlet }));
        const data = await getActivityLocation(activity);
        expect(data).to.deep.equal({
            state: 'Arkansas',
            country: 'United States',
            country_code: 'us',
            city: 'test',
        });
    });
    it('should return correct data is city property is village', async function () {
        sandbox
            .stub(axios, 'get')
            .resolves(Promise.resolve({ data: response.geoCode_village }));
        const data = await getActivityLocation(activity);
        expect(data).to.deep.equal({
            state: 'Arkansas',
            country: 'United States',
            country_code: 'us',
            city: 'test',
        });
    });
    it('should return correct data is city property is town', async function () {
        sandbox
            .stub(axios, 'get')
            .resolves(Promise.resolve({ data: response.geoCode_town }));
        const data = await getActivityLocation(activity);
        expect(data).to.deep.equal({
            state: 'Arkansas',
            country: 'United States',
            country_code: 'us',
            city: 'test',
        });
    });
    it('should return correct data is city property is suburb', async function () {
        sandbox
            .stub(axios, 'get')
            .resolves(Promise.resolve({ data: response.geoCode_suburb }));
        const data = await getActivityLocation(activity);
        expect(data).to.deep.equal({
            state: 'Arkansas',
            country: 'United States',
            country_code: 'us',
            city: 'test',
        });
    });
    it('should return correct data is city property is county', async function () {
        sandbox
            .stub(axios, 'get')
            .resolves(Promise.resolve({ data: response.geoCode_county }));
        const data = await getActivityLocation(activity);
        expect(data).to.deep.equal({
            state: 'Arkansas',
            country: 'United States',
            country_code: 'us',
            city: 'test',
        });
    });
    it("should return correct data is city property doesn't exist", async function () {
        sandbox
            .stub(axios, 'get')
            .resolves(Promise.resolve({ data: response.geoCode_null }));
        const data = await getActivityLocation(activity);
        expect(data).to.deep.equal({
            state: 'Arkansas',
            country: 'United States',
            country_code: 'us',
            city: null,
        });
    });
});
