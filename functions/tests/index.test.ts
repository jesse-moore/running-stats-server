import chai from 'chai';
import like from 'chai-like';
chai.should();
chai.use(like);

describe('Add single activity to empty database', function () {
    require('./addInitialActivity');
});

describe.only('Calculate Stats', function () {
    require('./calcStat');
});
