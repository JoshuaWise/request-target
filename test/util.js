'use strict';
const { TLSSocket } = require('tls');

class FakeRequest {
	constructor(url) {
		this.url = url;
		this.method = 'GET';
		this.headers = {};
		this.socket = {};
	}
	method(str) {
		this.method = str;
		return this;
	}
	host(str) {
		this.headers.host = str;
		return this;
	}
	secure(bool) {
		this.socket = bool ? Object.create(TLSSocket.prototype) : {};
		return this;
	}
}

exports.req = (...args) => new FakeRequest(...args);
