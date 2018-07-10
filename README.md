# request-target [![Build Status](https://travis-ci.org/JoshuaWise/request-target.svg?branch=master)](https://travis-ci.org/JoshuaWise/request-target)

## Another URL parser?

The core [`url`](https://nodejs.org/api/url.html) module is great for parsing generic URLs. Unfortunately, the URL of an HTTP request (formally called the [`request-target`](https://tools.ietf.org/html/rfc7230#section-5.3)), is *not* just a generic URL. It's a URL that must obey the requirements of the [URL RFC 3986](https://tools.ietf.org/html/rfc3986) *as well* as the [HTTP RFC 7230](https://tools.ietf.org/html/rfc7230).

## The problems

The core [`http`](https://nodejs.org/api/http.html) module does not validate or sanitize `req.url`.

The legacy [`url.parse()`](https://nodejs.org/api/url.html#url_legacy_url_api) function also allows illegal characters to appear.

The newer [`url.URL()`](https://nodejs.org/api/url.html#url_class_url) constructor will attempt to convert the input into a properly encoded URL with only legal characters. This is better for the general case, however, the official [http spec](https://tools.ietf.org/html/rfc7230#section-3.1.1) states:
> A recipient SHOULD NOT attempt to autocorrect and then process the request without a redirect, since the invalid request-line might be deliberately crafted to bypass security filters along the request chain.

This means a malformed URL should be treated as a violation of the http protocol. It's not something that should be accepted or autocorrected, and it's not something that higher-level code should ever have to worry about.

## Adoption into core

Because of backwards compatibility, it's unlikely that the logic expressed in `request-target` will be incorporated into the core [`http`](https://nodejs.org/api/http.html) module. My recommendation is to incorporate it as an alternative function in the core [`url`](https://nodejs.org/api/url.html) module. If that never happens, just make sure you're using this package when parsing `req.url`.

## How to use

The function takes a *request object* as input (not a URL string) because the http spec requires inspection of `req.method` and `req.headers.host` in order to properly interpret the URL of a request. If the function returns `null`, the request should not be processed further—either destroy the connection or respond with `Bad Request`.

If the request is valid, it will return an object with five properties: `protocol`, `hostname`, `port`, `pathname`, and `search`. The first three properties are either non-empty strings or `null`, and are mutually dependant. The `pathname` property is always a non-empty string, and the `search` property is always a possibly empty string.

If the first three properties are not `null`, it means the request was in [`absolute-form`](https://tools.ietf.org/html/rfc7230#section-5.3.2) or a valid non-empty [Host header](https://tools.ietf.org/html/rfc7230#section-5.4) was provided.

```js
const result = parse(req);
if (result) {
  // { protocol, hostname, port, pathname, search }
} else {
  res.writeHead(400);
  res.end();
}
```

## Unexpected benefits

The goal of `request-target` was not to create a fast parser, but it turns out this implementation can be between 1.5–9x faster than the general-purpose parsers in core.

```
$ npm run benchmark
legacy url.parse() x 371,681 ops/sec ±0.88% (297996 samples)
whatwg new URL() x 58,766 ops/sec ±0.3% (118234 samples)
request-target x 552,748 ops/sec ±0.54% (344809 samples)
```

> Run the benchmark yourself with `npm run benchmark`.
