import { expect } from 'chai';
import sinon, { SinonSandbox, SinonSpy, SinonStub } from 'sinon';
import * as admin from 'firebase-admin';
import fft from 'firebase-functions-test';
const test = fft();
import axios from 'axios';

import { strava_access_token } from '../../data/responses';

describe('(Strava) - getAccessToken', function () {
    let getAccessToken: any;
    let sandbox: SinonSandbox;
    let axiosStub: SinonStub;
    let adminInitStub: SinonStub;
    let firestoreStub: SinonStub;
    let firestore: SinonStub;
    let fakeSet: SinonSpy;
    let fakeGet: SinonSpy;
    let accessTokenFromFirebase = {
        accessToken: 'accessTokenFromFirebase',
        expiresAt: 500,
        refreshToken: 'refreshToken',
    };

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        axiosStub = sandbox.stub(axios, 'post');
        axiosStub.resolves(Promise.resolve(strava_access_token));
		adminInitStub = sandbox.stub(admin, 'initializeApp');
        firestoreStub = sandbox.stub();
        firestore = sandbox.stub(admin, 'firestore').get(() => firestoreStub);
        fakeSet = sandbox.fake();
        fakeGet = sandbox.fake.returns({
            exists: true,
            data: () => {
                return accessTokenFromFirebase;
            },
        });
        firestoreStub.returns({
            collection: () => {
                return {
                    doc: () => {
                        return { get: fakeGet, set: fakeSet };
                    },
                };
            },
        });
        getAccessToken = require('../../../src/strava/getAccessToken').default;
    });

    afterEach(() => {
		sandbox.reset();
        sandbox.restore();
        axiosStub.restore();
        test.cleanup();
    });

    it('should request token from firebase once', async function () {
        await getAccessToken();
        firestoreStub.should.have.been.calledOnce;
    });
    it('should return access token from firebase when expire time is more than 3000000 milliseconds from now', async function () {
        accessTokenFromFirebase.expiresAt = 9000000000000;
        const token = await getAccessToken();
        expect(token).to.eq('accessTokenFromFirebase');
    });
    it('should return new access token from strava when expire time is less than 3000000 milliseconds from now', async function () {
        accessTokenFromFirebase.expiresAt = 90000000;
        const token = await getAccessToken();
        expect(token).to.eq('accessTokenFromStrava');
    });
    it('should throw error if post request is rejected', async function () {
        axiosStub.resolves(Promise.reject({ message: 'test error' }));
        const token = 'token';
        try {
            await getAccessToken(token);
        } catch (error) {
            expect(error.message).to.equal('test error');
        }
    });
});
