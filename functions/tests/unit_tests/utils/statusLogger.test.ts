import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { MongoError } from 'mongodb';
import { CallbackError } from 'mongoose';
import statusLogger, { StatusObject } from '../../../src/utils/statusLogger';

describe('(utils) - statusLogger', function () {
    let sandbox: SinonSandbox;
    let consoleErrorStub: SinonStub;
    let statLogger: StatusObject;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        consoleErrorStub = sandbox.stub(console, 'error');
        statLogger = Object.assign({}, statusLogger);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should initialize statusLogger', function () {
        statLogger.init();
        expect(statLogger.databaseErrors).to.deep.equal([]);
        expect(statLogger.validationErrors).to.deep.equal([]);
    });
    it('should add validation error to statusLogger', function () {
        statLogger.init();
        const newError: CallbackError = {
            name: 'test error',
            message: 'test message',
        };
        statLogger.addValidationError(123, newError);
        expect(statLogger.databaseErrors).to.deep.equal([]);
        expect(statLogger.validationErrors).to.deep.equal([
            { id: 123, error: newError },
        ]);
    });
    it('(addValidationError) - should return undefined if undefined is given as an error', function () {
        statLogger.init();
        //@ts-ignore
        statLogger.addValidationError(123, undefined);
        expect(statLogger.databaseErrors).to.deep.equal([]);
        expect(statLogger.validationErrors).to.deep.equal([]);
    });
    it('(addDatabaseError) - should return undefined if undefined is given as an error', function () {
        statLogger.init();
        //@ts-ignore
        statLogger.addDatabaseError(undefined);
        expect(statLogger.databaseErrors).to.deep.equal([]);
        expect(statLogger.validationErrors).to.deep.equal([]);
    });
    it('should add database error to statusLogger', function () {
        statLogger.init();
        const newError: MongoError = new MongoError('test error');
        statLogger.addDatabaseError(newError);
        expect(statLogger.databaseErrors).to.deep.equal([newError]);
        expect(statLogger.validationErrors).to.deep.equal([]);
    });
    it('should log status', async function () {
        statLogger.init();
        const newMongoError: MongoError = new MongoError('test error');
        const newMongoError2: MongoError = new MongoError('test error2');
        statLogger.addDatabaseError(newMongoError);
        statLogger.addDatabaseError(newMongoError2);
        const newCallbackError: CallbackError = {
            name: 'callback error',
            message: 'test message',
        };
        const newCallbackError2: CallbackError = {
            name: 'callback error',
            message: 'test message2',
        };
        statLogger.addValidationError(123, newCallbackError);
        statLogger.addValidationError(456, newCallbackError2);
        statLogger.logStatus();
        const args = consoleErrorStub.args;
        expect(args).to.deep.equal([
            ['test message'],
            ['test message2'],
            ['Database Error: test error'],
            ['Database Error: test error2'],
        ]);
    });
});
