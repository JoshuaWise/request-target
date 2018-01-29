'use strict';
const host = require('./host');
const port = require('./port');
// https://tools.ietf.org/html/rfc3986#section-3.2
// https://tools.ietf.org/html/rfc3986#section-3.2.1
// https://tools.ietf.org/html/rfc3986#section-7.5
// https://tools.ietf.org/html/rfc7230#appendix-A.2
module.exports = `(?:(${host})(?::(${port}))?)`;
