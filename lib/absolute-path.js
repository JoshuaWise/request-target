'use strict';
const segment = require('./segment');
// https://tools.ietf.org/html/rfc7230#section-2.7
// Also see the comments in lib/segment.js
module.exports = `(?:(?:/${segment})+/?|/)`;
