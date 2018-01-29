'use strict';
const { TLSSocket } = require('tls');
const query = require('./lib/query');
const authority = require('./lib/authority');
const absolutePath = require('./lib/absolute-path');

// https://tools.ietf.org/html/rfc7230#section-5.3
const requestTarget = new RegExp(`^(?:(https?)://${authority}(?!\\*)|(?=[/*]))(?:(${absolutePath}|\\*$)${query}?)?$`, 'i');

// https://tools.ietf.org/html/rfc7230#section-5.4
const hostHeader = new RegExp(`^(?:${authority})?\\s*$`, 'i');

module.exports = (req) => {
	const target = req.url.match(requestTarget);
	if (!target) return null; // Invalid url
	
	let [,scheme = '', host = '', port = '', path = '', query = ''] = target;
	const isSecure = req.socket instanceof TLSSocket;
	
	if (scheme) {
		scheme = scheme.toLowerCase();
		if (!path) path = req.method === 'OPTIONS' ? '*' : '/';
	} else if (req.headers.host) { // Header is optional, to support HTTP/1.0
		const hostport = req.headers.host.match(hostHeader);
		if (!hostport) return null; // Invalid Host header
		if (hostport[1]) {
			[,host, port = ''] = hostport;
			scheme = isSecure ? 'https' : 'http';
		}
	}
	
	if (port && +port > 65535) return null; // Invalid port number
	if (host) {
		// DNS names have a maximum length of 255, including the root domain.
		if (host.length > (host.charCodeAt(host.length - 1) === 46 ? 255 : 254)) return null;
		if (!port) port = isSecure ? '443' : '80';
		host = host.toLowerCase();
		// Fake punycode labels are not valid IDNA labels.
		if (host.startsWith('xn--') && !punycode.toUnicode(host)) return null;
	}
	
	return { scheme, host, port, path, query };
};
