'use strict';
const query = require('./query');
const authority = require('./authority');
const absolutePath = require('./absolute-path');
// https://tools.ietf.org/html/rfc7230#section-5.3
// A more robust implementation could allow non-http schemes, although the spec
// is unclear about what such a thing would imply.
module.exports = new RegExp(`^(?:(https?:)//${authority}(?!\\*)|(?=[/*]))(${absolutePath}|\\*$)?${query}?$`, 'i');
