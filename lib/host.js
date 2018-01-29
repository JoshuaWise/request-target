'use strict';
const ipv4address = require('./ipv4address');
const ipv6address = require('./ipv6address');
const subdomain = require('./subdomain');
// https://tools.ietf.org/html/rfc3986#section-3.2.2
// This only supports DNS names, even though the actual spec supports arbitrary
// name registries. If this were to be adopted into core, it should probably
// not have such a restriction.
const ipliteral = `(?:\\[${ipv6address}\\])`;
module.exports = `(?:${ipliteral}|${ipv4address}|${subdomain})`;
