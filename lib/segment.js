'use strict';
// https://tools.ietf.org/html/rfc3986#appendix-A
// We are slightly more strict than the spec, forcing segments to be non-empty.
// The reasoning is that double slashes in the path ("//") much more often
// indicate an improperly-concatenated url, rather than an intentional resource
// path. If this were to be adopted into core, empty segments should be allowed.
module.exports = '(?:(?:[a-z0-9._~!$&\'()*+,;=:@-]|%[0-9a-f]{2})+)';
