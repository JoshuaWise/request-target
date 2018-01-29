'use strict';
// https://tools.ietf.org/html/rfc3986#section-3.2.3
// Although the spec strangely allows any number of digits, we restrict it to
// five, since the largest valid port number is 65535. If this were to be
// adopted into core, it should probably follow the spec instead.
module.exports = '(?:[0-9]{0,5})';
