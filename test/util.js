'use strict';
const { TLSSocket } = require('tls');

class FakeRequest {
	constructor(url) {
		this.url = url;
		this.method = 'GET';
		this.headers = {};
		this.socket = {};
	}
	options() {
		this.method = 'OPTIONS';
		return this;
	}
	host(str) {
		this.headers.host = str;
		return this;
	}
	secure() {
		this.socket = Object.create(TLSSocket.prototype);
		return this;
	}
}

exports.req = (...args) => new FakeRequest(...args);
