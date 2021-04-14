import { expect } from 'chai';
import sinon, { SinonSandbox, SinonSpy, SinonStub } from 'sinon';
import * as admin from 'firebase-admin';
import fft from 'firebase-functions-test';
const test = fft();
import axios from 'axios';
import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } from '../../../src/keys.json';
import { strava_access_token } from '../../data/responses';

describe('(Strava) - getNewToken', async function () {
    let getNewToken: any;
    let sandbox: SinonSandbox;
    let adminInitStub: SinonStub;
    let firestoreStub: SinonStub;
    let fakeSet: SinonSpy;
    let axiosStub: SinonStub;
    let firestore: SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        axiosStub = sandbox.stub(axios, 'post');
        axiosStub.resolves(Promise.resolve(strava_access_token));
        adminInitStub = sandbox.stub(admin, 'initializeApp');
        firestoreStub = sandbox.stub();
        firestore = sandbox.stub(admin, 'firestore').get(() => firestoreStub);
        fakeSet = sandbox.fake();
        firestoreStub.returns({
            collection: () => {
                return {
                    doc: () => {
                        return { set: fakeSet };
                    },
                };
            },
        });
        getNewToken = require('../../../src/strava/getNewToken').default;
    });

    afterEach(() => {
        sandbox.restore();
        axiosStub.restore();
        test.cleanup();
    });

    it('should make get request once', async function () {
        await getNewToken('token');
        axiosStub.should.have.been.calledOnce;
        firestoreStub.should.have.been.calledOnce;
    });
    it('should make get request with correct arguments', async function () {
        const token = 'token';
        await getNewToken(token);
        const url = `https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${token}`;
        const config = {
            headers: {
                Accept: '*/*',
            },
        };
        expect(axiosStub.calledWith(url, config)).true;
    });
    it('should throw error if post request is rejected', async function () {
        axiosStub.resolves(Promise.reject({ message: 'test error' }));
        const token = 'token';
        try {
            await getNewToken(token);
        } catch (error) {
            expect(error.message).to.equal('test error');
        }
    });
});

// docStub.returns({ set: () => Promise.resolve() });
// refStub.withArgs(collection).returns({ doc: addStub });
