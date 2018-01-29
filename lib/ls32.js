'use strict';
const h16 = require('./h16');
const ipv4address = require('./ipv4address');
// https://tools.ietf.org/html/rfc3986#appendix-A
module.exports = `(?:${h16}:${h16}|${ipv4address})`;
