import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import axios from 'axios';
import * as firebase from '../../../src/firebase';
import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } from '../../../src/keys.json';
import { strava_access_token } from '../../data/responses';
import getNewToken from '../../../src/strava/getNewToken';

describe('(Strava) - getNewToken', async function () {
    let sandbox: SinonSandbox;
    let axiosStub: SinonStub;
    let firebaseStub: SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        axiosStub = sandbox.stub(axios, 'post');
        axiosStub.resolves(Promise.resolve(strava_access_token));
        firebaseStub = sandbox.stub(firebase, 'saveNewToken');
    });

    afterEach(() => {
        sandbox.restore();
        axiosStub.restore();
    });

    it('should make get request once', async function () {
        await getNewToken('token');
        axiosStub.should.have.been.calledOnce;
        firebaseStub.should.have.been.calledOnce;
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
