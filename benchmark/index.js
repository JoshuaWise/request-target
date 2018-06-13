'use strict';
const nodemark = require('nodemark');
const fake = require('./fake');

const legacy = require('url').parse;
const whatwg = require('url').URL;
const parseRequest = require('../.');

let request;
const setup = () => request = ({
	url: fake.choose(0.8) ? fake.path() : fake.url(),
	headers: { host: fake.host() },
	method: fake.method(),
});

const benchmark = (name, fn) => console.log(`${name} x ${nodemark(fn, setup)}`);

benchmark('legacy url.parse()', () => legacy(request.url));
benchmark('whatwg new URL()', () => new whatwg(request.url, 'http://my.implied.origin'));
benchmark('request-target', () => parseRequest(request));
