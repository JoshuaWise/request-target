'use strict';
const { TLSSocket } = require('tls');
const punycode = require('punycode');
const requestTarget = require('./lib/request-target');
const hostHeader = require('./lib/host-header');

// https://tools.ietf.org/html/rfc7230#section-5.5
module.exports = (req) => {
	const target = req.url.match(requestTarget);
	if (!target) return null; // Invalid url
	
	let [,scheme = null, host = null, port = null, path, query = ''] = target;
	const isSecure = req.socket instanceof TLSSocket;
	
	if (scheme) {
		scheme = scheme.toLowerCase();
		if (!path) path = req.method === 'OPTIONS' ? '*' : '/';
	} else if (req.headers.host) { // Header is optional, to support HTTP/1.0
		const hostport = req.headers.host.match(hostHeader);
		if (!hostport) return null; // Invalid Host header
		if (hostport[1]) {
			[,host, port = null] = hostport;
			scheme = isSecure ? 'https:' : 'http:';
		}
	}
	
	if (host) {
		// DNS names have a maximum length of 255, including the root domain.
		if (host.length > (host.charCodeAt(host.length - 1) === 46 ? 255 : 254)) return null;
		host = host.toLowerCase();
		// Fake punycode labels are not valid IDNA labels.
		// https://tools.ietf.org/html/rfc5890#section-2.3.1
		if (host.startsWith('xn--') && !punycode.toUnicode(host)) return null;
		if (port) {
			const num = +port;
			if (num > 65535) return null; // Invalid port number
			if (port.charCodeAt(0) === 48) port = '' + num; // Remove leading zeros
		} else {
			port = isSecure ? '443' : '80';
		}
	}
	
	// Rename fields to make it familiar with standard APIs.
	return { protocol: scheme, hostname: host, port, pathname: path, search: query };
};
