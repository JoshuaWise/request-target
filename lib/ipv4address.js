'use strict';
// https://tools.ietf.org/html/rfc3986#appendix-A
const decOctet = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])';
module.exports = `(?:(?:${decOctet}\\.){3}${decOctet})`;
