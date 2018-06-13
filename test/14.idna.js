'use strict';
const { expect } = require('chai');
const { req } = require('./util');
const parse = require('../.');

// Fake punycode labels are not valid IDNA labels.
// https://tools.ietf.org/html/rfc5890#section-2.3.1

describe('IDNA', function () {
	it('should reject fake punycode in origin-form');
	it('should reject fake punycode in absolute-form');
});
