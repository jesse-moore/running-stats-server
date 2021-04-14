import { expect } from 'chai';
import makeStatID from '../../../src/utils/makeStatID';
require("../index.test")

describe('makeStatID', function(){
	it('should return "202104"', function(){
		expect(makeStatID(2021,4)).to.equal(202104);
	})
	it('should return "202112"', function(){
		expect(makeStatID(2021,12)).to.equal(202112);
	})
	it('should return "202100"', function(){
		expect(makeStatID(2021,null)).to.equal(202100);
	})
	it('should return "0"', function(){
		expect(makeStatID(null,null)).to.equal(0);
	})
})