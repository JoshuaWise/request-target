'use strict';
const { expect } = require('chai');
const { req } = require('./util');
const parse = require('../.');

describe('authority-form', function () {
	it('should reject authority-form request-targets', function () {
		expect(parse(req('some.host')))
			.to.equal(null);
		expect(parse(req('some.host:80')))
			.to.equal(null);
		expect(parse(req('some.host:443')))
			.to.equal(null);
		expect(parse(req('user@some.host:443')))
			.to.equal(null);
		expect(parse(req('user:password@some.host:443')))
			.to.equal(null);
	});
});
