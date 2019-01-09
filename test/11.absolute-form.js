'use strict';
const { expect } = require('chai');
const { req } = require('./util');
const parse = require('../.');

const expected = {
	protocol: 'http:',
	hostname: 'some.host',
	port: '80',
	pathname: '/path/to/resource',
	search: '?foo=1&bar=2',
};

describe('absolute-form', function () {
	it('should parse valid absolute-form request-targets', function () {
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('some.host')))
			.to.deep.equal(expected);
	});
	it('should use a default scheme', function () {
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('some.host').secure()))
			.to.deep.equal({ ...expected, protocol: 'https:', port: '443' });
	});
	it('should respect the port', function () {
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('some.host:1024')))
			.to.deep.equal({ ...expected, port: '1024' });
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('some.host:9999').secure()))
			.to.deep.equal({ ...expected, protocol: 'https:', port: '9999' });
	});
	it('should allow a missing host header', function () {
		expect(parse(req('/path/to/resource?foo=1&bar=2')))
			.to.deep.equal({ ...expected, protocol: null, hostname: null, port: null });
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('')))
			.to.deep.equal({ ...expected, protocol: null, hostname: null, port: null });
	});
	it('should lowercase the host', function () {
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('sOme.hoSt')))
			.to.deep.equal(expected);
	});
	it('should trim whitespace from host', function () {
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('some.host \t ')))
			.to.deep.equal({ ...expected, hostname: 'some.host' });
	});
	it('should accept the root domain in host', function () {
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('some.host.')))
			.to.deep.equal({ ...expected, hostname: 'some.host.' });
	});
	it('should accept subdomains starting with numbers', function () {
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('012.345.g0')))
			.to.deep.equal({ ...expected, hostname: '012.345.g0' });
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('012.345.0g')))
			.to.deep.equal({ ...expected, hostname: '012.345.0g' });
	});
	it('should accept IPv4 addresses', function () {
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('111.22.0.255')))
			.to.deep.equal({ ...expected, hostname: '111.22.0.255' });
	});
	it('should accept IPv6 addresses', function () {
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('[::]')))
			.to.deep.equal({ ...expected, hostname: '[::]' });
	});
	it('should reject invalid hosts', function () {
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('http://some.host')))
			.to.equal(null);
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('some.host..')))
			.to.equal(null);
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('some..host')))
			.to.equal(null);
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('some.999')))
			.to.equal(null);
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('some.1-2')))
			.to.equal(null);
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('111.22.0.256')))
			.to.equal(null);
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('111.22.0')))
			.to.equal(null);
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('012.345.0')))
			.to.equal(null);
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('[12345::]')))
			.to.equal(null);
	});
	it('should reject invalid port numbers', function () {
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('some.host:-1')))
			.to.equal(null);
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('some.host:65536')))
			.to.equal(null);
		expect(parse(req('/path/to/resource?foo=1&bar=2').host('some.host:000080')))
			.to.equal(null);
	});
	it('should reject invalid paths', function () {
		expect(parse(req('/path/to//resource?foo=1&bar=2').host('some.host')))
			.to.equal(null);
		expect(parse(req('/path/to/re{source?foo=1&bar=2').host('some.host')))
			.to.equal(null);
		expect(parse(req('?foo=1&bar=2').host('some.host')))
			.to.equal(null);
		expect(parse(req('').host('some.host')))
			.to.equal(null);
	});
	it('should reject invalid searches', function () {
		expect(parse(req('/path/to/resource?foo=1&bar=2#baz').host('some.host')))
			.to.equal(null);
		expect(parse(req('/path/to/re{source?foo=1&bar=2{').host('some.host')))
			.to.equal(null);
	});
	it('should reject hosts that are too long', function () {
		expect(parse(req(`/path/to/resource?foo=1&bar=2`).host(`some${'.host'.repeat(50)}`)))
			.to.deep.equal({ ...expected, hostname: `some${'.host'.repeat(50)}` });
		expect(parse(req(`/path/to/resource?foo=1&bar=2`).host(`some${'.host'.repeat(50)}.`)))
			.to.deep.equal({ ...expected, hostname: `some${'.host'.repeat(50)}.` });
		expect(parse(req(`/path/to/resource?foo=1&bar=2`).host(`some${'.host'.repeat(50)}x`)))
			.to.equal(null);
		expect(parse(req(`/path/to/resource?foo=1&bar=2`).host(`some${'.host'.repeat(50)}x.`)))
			.to.equal(null);
	});
});
