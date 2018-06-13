'use strict';
const { expect } = require('chai');
const { req } = require('./util');
const parse = require('../.');

const expected = {
	protocol: 'http:',
	hostname: 'some.host',
	port: '80',
	pathname: '*',
	search: '',
};

describe('asterisk-form', function () {
	it('should parse valid asterisk-form request-targets', function () {
		expect(parse(req('*').host('some.host')))
			.to.deep.equal(expected);
		expect(parse(req('*').host('some.host').options()))
			.to.deep.equal(expected);
	});
	it('should reject when there is a search component', function () {
		expect(parse(req('*?').host('some.host')))
			.to.equal(null);
		expect(parse(req('*?foo=1&bar=2').host('some.host')))
			.to.equal(null);
	});
});
