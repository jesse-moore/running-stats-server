import { expect, assert } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import axios from 'axios';
import fetchActivity from '../../../src/strava/fetchActivity';

describe('(Strava) - fetchActivity', function () {
    let sandbox: SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should make get request once', async function () {
        const stub = sandbox.stub(axios, 'get');
        stub.resolves(Promise.resolve({ data: {} }));
        await fetchActivity('token', 1234);
        stub.should.have.been.calledOnce;
    });
    it('should make get request with correct arguments', async function () {
        const stub = sandbox.stub(axios, 'get');
        stub.resolves(Promise.resolve({ data: {} }));
        await fetchActivity('token', 1234);

        const url = 'https://www.strava.com/api/v3/activities/1234';
        const config = {
            headers: {
                Authorization: `Bearer token`,
                Accept: 'application/json',
                scope: 'read_all',
                'cache-control': 'no-cache',
            },
        };
        expect(stub.calledWith(url, config)).true;
    });
    it('should respond with "data"', async function () {
        const stub = sandbox.stub(axios, 'get');
        stub.resolves(Promise.resolve({ data: 'data' }));
        const data = await fetchActivity('token', 1234);
        expect(data).be.equal('data');
    });
    it('should respond with null if id not found', async function () {
        const stub = sandbox.stub(axios, 'get');
        stub.resolves(
            Promise.reject({
                response: { data: { message: 'Resource Not Found' } },
            })
        );
        const data = await fetchActivity('token', 1234);
        expect(data).null;
    });
    it('should throw error if fetch is rejected with an unknown error', async function () {
        const stub = sandbox.stub(axios, 'get');
        stub.rejects(
            Promise.resolve({
                response: 'unknown error',
            })
        );
        try {
            await fetchActivity('token', 1234);
        } catch (error) {
            expect(error.message).to.equal(
                'Strava Fetch Error: Failed to fetch activity id: 1234 from strava'
            );
        }
    });
});
