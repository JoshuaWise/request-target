'use strict';
const authority = require('./authority');
// https://tools.ietf.org/html/rfc7230#section-5.4
module.exports = new RegExp(`^(?:${authority})?\\s*$`, 'i');
