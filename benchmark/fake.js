'use strict';
const methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'];
const seps = ['.', '_', '~', '!', '$', '&', '\'', '(', ')', '*', '+', ',', ';', '=', ':', '@', '-'];

const gen = (fn, n) => { let r = ''; while (n--) r += fn(); return r; };
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const choose = (c = 0.5) => Math.random() < c;

const letter = () => String.fromCharCode(rand(65, 90) + (choose(0.9) ? 32 : 0));
const digit = () => String.fromCharCode(rand(48, 57));
const ld = () => choose(0.95) ? letter() : digit();
const subdomain = () => gen(ld, rand(2, 16)) + '.';
const scheme = () => choose() ? 'http' : 'https';
const host = () => gen(subdomain, rand(1, 3)) + gen(letter, rand(2, 4));
const port = () => gen(digit, rand(1, 4));
const authority = () => choose() ? host() : `${host()}:${port()}`;
const sep = () => seps[rand(0, seps.length - 1)];
const pctEncoded = () => '%' + rand(0, 15).toString(16) + rand(0, 15).toString(16);
const pchar = () => choose(0.9) ? ld() : choose() ? sep() : pctEncoded();
const segment = () => '/' + gen(pchar, rand(1, 32));
const path = () => choose(0.1) ? '/' : gen(segment, rand(1, 6));
const query = () => choose(0.2) ? '' : '?' + gen(pchar, rand(2, 64));

// Normally, v8 uses fancy tricks to avoid concatenation. This forces v8 to
// store the string as a single buffer, as it would be coming over the wire.
const serialize = (str) => { Number(str); return str; };

exports.choose = choose;
exports.path = () => serialize(path() + query());
exports.host = () => serialize(authority());
exports.url = () => serialize(scheme() + '://' + authority() + (choose(0.1) ? '' : path()) + query());
exports.method = () => methods[rand(0, methods.length - 1)];
