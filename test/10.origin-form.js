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

describe('origin-form', function () {
	it('should parse valid origin-form request-targets', function () {
		expect(parse(req('http://some.host/path/to/resource?foo=1&bar=2')))
			.to.deep.equal(expected);
	});
	it('should respect the scheme', function () {
		expect(parse(req('http://some.host/path/to/resource?foo=1&bar=2').secure(true)))
			.to.deep.equal(expected);
		expect(parse(req('https://some.host/path/to/resource?foo=1&bar=2')))
			.to.deep.equal({ ...expected, protocol: 'https:', port: '443' });
	});
	it('should respect the port', function () {
		expect(parse(req('http://some.host:1024/path/to/resource?foo=1&bar=2')))
			.to.deep.equal({ ...expected, port: '1024' });
		expect(parse(req('https://some.host:9999/path/to/resource?foo=1&bar=2')))
			.to.deep.equal({ ...expected, protocol: 'https:', port: '9999' });
	});
	it('should ignore the host header', function () {
		expect(parse(req('http://some.host/path/to/resource?foo=1&bar=2').host('other.host')))
			.to.deep.equal(expected);
		expect(parse(req('http://some.host/path/to/resource?foo=1&bar=2').host('some.host:9999')))
			.to.deep.equal(expected);
		expect(parse(req('http://some.host/path/to/resource?foo=1&bar=2').host('!....invalid....::-2')))
			.to.deep.equal(expected);
	});
	it('should use a default path if not provided', function () {
		expect(parse(req('http://some.host?foo=1&bar=2')))
			.to.deep.equal({ ...expected, pathname: '/' });
		expect(parse(req('http://some.host?foo=1&bar=2').options()))
			.to.deep.equal({ ...expected, pathname: '*' });
	});
	it('should lowercase the scheme and host', function () {
		expect(parse(req('HtTp://some.HOST/path/to/resource?foo=1&bar=2')))
			.to.deep.equal(expected);
	});
	it('should accept the root domain in host', function () {
		expect(parse(req('http://some.host./path/to/resource?foo=1&bar=2')))
			.to.deep.equal({ ...expected, hostname: 'some.host.' });
	});
	it('should accept subdomains starting with numbers', function () {
		expect(parse(req('http://012.345.g0/path/to/resource?foo=1&bar=2')))
			.to.deep.equal({ ...expected, hostname: '012.345.g0' });
	});
	it('should accept IPv4 addresses', function () {
		expect(parse(req('http://111.22.0.255/path/to/resource?foo=1&bar=2')))
			.to.deep.equal({ ...expected, hostname: '111.22.0.255' });
	});
	it('should accept IPv6 addresses', function () {
		expect(parse(req('http://[::]/path/to/resource?foo=1&bar=2')))
			.to.deep.equal({ ...expected, hostname: '[::]' });
	});
	it('should reject invalid schemes', function () {
		expect(parse(req('httpss://some.host/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
		expect(parse(req('ws://some.host/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
		expect(parse(req('://some.host/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
		expect(parse(req('//some.host/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
		expect(parse(req('some.host/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
	});
	it('should reject invalid hosts', function () {
		expect(parse(req('http://some.host../path/to/resource?foo=1&bar=2')))
			.to.equal(null);
		expect(parse(req('http://some..host/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
		expect(parse(req('http://some.1host/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
		expect(parse(req('http://111.22.0.256/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
		expect(parse(req('http://111.22.0/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
		expect(parse(req('http://012.345.0/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
		expect(parse(req('http://[12345::]/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
	});
	it('should reject invalid port numbers', function () {
		expect(parse(req('http://some.host:-1/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
		expect(parse(req('http://some.host:65536/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
		expect(parse(req('http://some.host:000080/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
	});
	it('should reject invalid paths', function () {
		expect(parse(req('http://some.host/path/to//resource?foo=1&bar=2')))
			.to.equal(null);
		expect(parse(req('http://some.host/path/to/re{source?foo=1&bar=2')))
			.to.equal(null);
	});
	it('should reject invalid searches', function () {
		expect(parse(req('http://some.host/path/to/resource?foo=1&bar=2#baz')))
			.to.equal(null);
		expect(parse(req('http://some.host/path/to/re{source?foo=1&bar=2{')))
			.to.equal(null);
	});
	it('should reject hosts that are too long', function () {
		expect(parse(req(`http://some${'.host'.repeat(50)}/path/to/resource?foo=1&bar=2`)))
			.to.deep.equal({ ...expected, hostname: `some${'.host'.repeat(50)}` });
		expect(parse(req(`http://some${'.host'.repeat(50)}./path/to/resource?foo=1&bar=2`)))
			.to.deep.equal({ ...expected, hostname: `some${'.host'.repeat(50)}.` });
		expect(parse(req(`http://some${'.host'.repeat(50)}x/path/to/resource?foo=1&bar=2`)))
			.to.equal(null);
		expect(parse(req(`http://some${'.host'.repeat(50)}x./path/to/resource?foo=1&bar=2`)))
			.to.equal(null);
	});
	it('should reject fake punycode hosts', function () {
		expect(parse(req('http://xn--some.host/path/to/resource?foo=1&bar=2')))
			.to.equal(null);
	});
});
