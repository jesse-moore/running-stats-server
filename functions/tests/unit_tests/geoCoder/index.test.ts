import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import axios from 'axios';
import { fetchLocationData } from '../../../src/geoCoder';

describe('geoCoder', function () {
    let sandbox: SinonSandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });
    afterEach(() => {
        sandbox.restore();
    });
    it('should respond with data', async () => {
        sandbox.stub(axios, 'get').resolves(Promise.resolve({ data: 'data' }));
        const data = await fetchLocationData({ lat: 36.21171, lng: -94.14614 });
        expect(data).to.equal('data');
    });
    it('should return null when argument is undefined', async () => {
        sandbox.stub(axios, 'get').resolves(Promise.resolve({ data: 'data' }));
        const data = await fetchLocationData(undefined);
        expect(data).null;
    });
    it('should send one request', async () => {
        const stub = sandbox
            .stub(axios, 'get')
            .resolves(Promise.resolve({ data: 'data' }));
        await fetchLocationData({ lat: 36.21171, lng: -94.14614 });
        stub.should.have.been.calledOnce;
    });
    it('should throw error if response has error property', async () => {
        sandbox.stub(axios, 'get').resolves(Promise.reject());
        try {
            await fetchLocationData({ lat: 36.21171, lng: -94.14614 });
        } catch (error) {
            expect(error.message).to.eq('Failed to Geocode');
        }
    });
});
