import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import * as firebase from '../../../src/firebase';
import * as strava from '../../../src/strava';
import { getStravaAccessToken } from '../../../src/strava/';

describe('(Strava) - getAccessToken', function () {
    let sandbox: SinonSandbox;
    let accessTokenFromFirebase = {
        accessToken: 'accessTokenFromFirebase',
        expiresAt: 500,
        refreshToken: 'refreshToken',
    };
    let stravaStub: SinonStub;
    let firebaseStub: SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        stravaStub = sandbox
            .stub(strava, 'getNewToken')
            .resolves('accessTokenFromStrava');
        firebaseStub = sandbox
            .stub(firebase, 'getStravaAccessToken')
            .resolves(accessTokenFromFirebase);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should request token from firebase once', async function () {
        await getStravaAccessToken();
        firebaseStub.should.have.been.calledOnce;
    });
    it('should return access token from firebase when expire time is more than 3000000 milliseconds from now', async function () {
        accessTokenFromFirebase.expiresAt = 9000000000000;
        const token = await getStravaAccessToken();
        expect(token).to.eq('accessTokenFromFirebase');
    });
    it('should return new access token from strava when expire time is less than 3000000 milliseconds from now', async function () {
        accessTokenFromFirebase.expiresAt = 90000000;
        const token = await getStravaAccessToken();
        expect(token).to.eq('accessTokenFromStrava');
    });
});
