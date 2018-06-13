'use strict';
// https://tools.ietf.org/html/rfc1034#section-3.5
// https://tools.ietf.org/html/rfc1123#section-2.1
const label = '(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)';
const topLevelLabel = '(?:[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?)';
module.exports = `(?:(?:${label}\\.)*${topLevelLabel}\\.?)`;
