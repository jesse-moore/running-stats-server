import { Change } from 'firebase-functions';
import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import test from 'firebase-functions-test';
import getNewIds from '../../../src/utils/getNewIds';

describe('(utils) - getNewIds', function () {
    let sandbox: SinonSandbox;
    let documentBefore = test().firestore.makeDocumentSnapshot(
        { ids: [] },
        'admin/strava/idQueue'
    );
    let documentAfter = test().firestore.makeDocumentSnapshot(
        { ids: [123] },
        'admin/strava/idQueue'
    );

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return any added ids from before to after', function () {
        documentBefore = test().firestore.makeDocumentSnapshot(
            { ids: [123] },
            'admin/strava/idQueue'
        );
        documentAfter = test().firestore.makeDocumentSnapshot(
            { ids: [123, 456] },
            'admin/strava/idQueue'
        );
        const documentChange = Change.fromObjects(
            documentBefore,
            documentAfter
        );
        const result = getNewIds(documentChange);
        expect(result).to.deep.equal([456]);
    });
    it('should return null if ids is not an array', function () {
        documentBefore = test().firestore.makeDocumentSnapshot(
            { ids: null },
            'admin/strava/idQueue'
        );
        documentAfter = test().firestore.makeDocumentSnapshot(
            { ids: null },
            'admin/strava/idQueue'
        );
        const documentChange = Change.fromObjects(
            documentBefore,
            documentAfter
        );
        const result = getNewIds(documentChange);
        expect(result).null;
    });
});
