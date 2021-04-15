import { expect } from 'chai';
import sinon, { SinonSandbox, SinonSpy, SinonStub } from 'sinon';
import mongoose from 'mongoose';
import { connectMongoose, closeMongoose } from '../../../src/mongoDB';

describe('(mongoDB)', function () {
    let sandbox: SinonSandbox;
    let mongooseSetFake: SinonSpy;
    let mongooseConnectStub: SinonStub;
    let mongooseCloseStub: SinonStub;
    let mongooseConnectionStub: SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        mongooseSetFake = sandbox.fake();
        mongooseCloseStub = sandbox.stub();
        mongooseCloseStub.resolves();
        sandbox.stub(mongoose, 'set').callsFake(mongooseSetFake);
        mongooseConnectStub = sandbox.stub(mongoose, 'connect').resolves();
        mongooseConnectionStub = sandbox
            .stub(mongoose, 'connection')
            .value({ readyState: 0, close: mongooseCloseStub });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call mongoose.connect once', async function () {
        await connectMongoose();
        mongooseConnectStub.should.have.been.calledOnce;
    });
    it('should not call mongoose.connect if already connected', async function () {
        mongooseConnectionStub.value({ readyState: 1 });
        await connectMongoose();
        mongooseConnectStub.should.not.have.been.called;
    });
    it('should call mongoose.connect with correct arguments', async function () {
        await connectMongoose();
        const args = mongooseConnectStub.firstCall.args;
        expect(typeof args[0]).to.equal('string');
        expect(args[1]).to.deep.equal({
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });
    it('should set mongoose with correct properties', async function () {
        await connectMongoose();
        const args = mongooseSetFake.args;
        args.forEach((arg) => {
            if (arg[0] === 'useCreateIndex')
                return expect(arg[1]).to.equal(true);
            if (arg[0] === 'useFindAndModify')
                return expect(arg[1]).to.equal(false);
            throw new Error(`Unexpected argument: ${arg[0]}`);
        });
    });
    it('should throw error if mongoos.connect is rejected', async function () {
        mongooseConnectStub.rejects({ message: 'test error' });
        try {
            await connectMongoose();
            throw new Error('Should have failed');
        } catch (error) {
            expect(error.message).to.equal(
                'error connecting to MongoDB: test error'
            );
        }
    });
    it('should call mongoose.connection.close once', async function () {
        mongooseConnectionStub.value({
            readyState: 1,
            close: mongooseCloseStub,
        });
        await closeMongoose();
        mongooseCloseStub.should.have.been.calledOnce;
    });

    it('should not call mongoose.connection.close if connection is close or is closing', async function () {
        mongooseConnectionStub.value({
            readyState: 0,
            close: mongooseCloseStub,
        });
        await closeMongoose();
        mongooseConnectionStub.value({
            readyState: 3,
            close: mongooseCloseStub,
        });
        await closeMongoose();
        expect(mongooseCloseStub.notCalled).true;
    });
});
