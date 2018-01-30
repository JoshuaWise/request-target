'use strict';
const fs = require('fs');
const path = require('path');
const suite = new (require('benchmark').Suite);

const legacy = require('url').parse;
const whatwg = require('url').URL;
const parseRequest = require('../.');

const setup = new Function('\'use strict\'; const exports = {};\n'
	+ fs.readFileSync(path.join(__dirname, 'fake.js')) + ';\n'
	+ fs.readFileSync(path.join(__dirname, 'setup.js')));

suite.add('legacy url.parse()', {
	setup,
	fn() { return legacy(requests[--iteration].url); },
});

suite.add('whatwg new URL()', {
	setup,
	fn() { return new whatwg(requests[--iteration].url, 'http://my.implied.origin'); }
});

suite.add('parse-http-url parseRequest()', {
	setup,
	fn() { return parseRequest(requests[--iteration]); }
});

suite.on('cycle', (event) => {
	console.log(String(event.target));
});
suite.run();
