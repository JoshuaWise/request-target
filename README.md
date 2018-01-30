# parse-http-url

## Another URL parser?

The core [`url`](https://nodejs.org/api/url.html) module is great for parsing generic URLs. Unfortunately, the URL of an HTTP request (formally called the [`request-target`](https://tools.ietf.org/html/rfc7230#section-5.3)), is *not* just a generic URL. It's a URL that must obey the requirements of the [URL RFC 3986](https://tools.ietf.org/html/rfc3986) *as well* as the [HTTP RFC 7230](https://tools.ietf.org/html/rfc7230).

## The problems

The core [`http`](https://nodejs.org/api/http.html) module does not validate or sanitize `req.url`.

The legacy [`url.parse()`](https://nodejs.org/api/url.html#url_legacy_url_api) function also allows illegal characters to appear.

The newer [`url.URL()`](https://nodejs.org/api/url.html#url_class_url) constructor will attempt to convert the input into a properly encoded URL with only legal characters. This is better for the general case, however, the official [http spec](https://tools.ietf.org/html/rfc7230#section-3.1.1) states:
> A recipient SHOULD NOT attempt to autocorrect and then process the request without a redirect, since the invalid request-line might be deliberately crafted to bypass security filters along the request chain.

This means a malformed URL should be treated as a violation of the http protocol. It's not something that should be accepted or autocorrected, and it's not something that higher-level code should ever have to worry about.

## The severity

It's tempting to use the [Robustness Principle](https://en.wikipedia.org/wiki/Robustness_principle) as an argument for using the `url.URL` constructor here. Normally, it can be acceptable to diverge from the spec if the result is harmless and beneficial. However, this is not one of those cases. The strictness of URL correctness exists in the spec explicity for security reasons, which should be non-negotiable—especially for a large and respected platform such as Node.js.

## Adoption into core

Because of backwards compatibility, it's unlikely that the logic expressed in `parse-http-url` will be incorporated into the core [`http`](https://nodejs.org/api/http.html) module. My recommendation is to either incorporate it into [`http2`](https://nodejs.org/api/http2.html), which is still considered experimental, or as an alternative function in the core [`url`](https://nodejs.org/api/url.html) module. There are many paths forward, but subjecting millions of unsuspecting users to potential security vulnerabilities is not an acceptable practice.

## How to use

The function takes a *request object* as input (not a URL string) because the http spec requires inspection of `req.method` and `req.headers.host` in order to properly interpret the URL of a request. If the function returns `null`, the request should not be processed further—either destroy the connection or respond with `Bad Request`.

If the request is valid, it will return an object with five properties: `protocol`, `hostname`, `port`, `pathname`, and `search`. The first three properties are either non-empty strings or `null`, and are mutually dependant. The `path` property is always a non-empty string, and the `search` property is always a possibly empty string.

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

This goal of `parse-http-url` was not to create a fast parser, but it turns out this implementation can be between 2–9x faster than the general-purpose parsers in core.

```
$ npm run benchmark
legacy url.parse() x 285,869 ops/sec ±3.70% (20 runs sampled)
whatwg new URL() x 54,509 ops/sec ±0.99% (51 runs sampled)
parse-http-url parseRequest() x 500,782 ops/sec ±4.01% (14 runs sampled)
```

> Run the benchmark yourself with `npm run benchmark`.
