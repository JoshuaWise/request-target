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
		// Note: the spec does not clearly state what to do when asterisk-form
		// is used with a method other than OPTIONS. It simply says it is "only
		// used for a server-wide OPTIONS request".
		// https://tools.ietf.org/html/rfc7230#section-5.3.4
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
