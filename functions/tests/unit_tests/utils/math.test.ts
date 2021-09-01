import { expect } from 'chai';
import * as math from '../../../src/utils/math';

describe('(utils) - math', function () {
    it('should return number rounded to two decimals', function () {
        expect(math.toFixed(123.456, 2)).equal(123.46);
    });
    it('(max) - should return a if b is null', function () {
        expect(math.max(1, null)).equal(1);
    });
    it('(max) - should return b if a is null', function () {
        expect(math.max(null, 2)).equal(2);
    });
    it('(max) - should return b if a<b', function () {
        expect(math.max(1, 2)).equal(2);
    });
    it('(min) - should return a if b is null', function () {
        expect(math.min(1, null)).equal(1);
    });
    it('(min) - should return b if a is null', function () {
        expect(math.min(null, 2)).equal(2);
    });
    it('(min) - should return b if a>b', function () {
        expect(math.min(2, 1)).equal(1);
    });
});
