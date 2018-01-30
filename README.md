# http-url

## Another URL parser?

The core [`url`](https://nodejs.org/api/url.html) module is great for parsing generic URLs. Unfortunately, the URL of an HTTP request (formally called the [`request-target`](https://tools.ietf.org/html/rfc7230#section-5.3)), is *not* just a generic URL. It's a URL that must obey the requirements of the [URL RFC 3986](https://tools.ietf.org/html/rfc3986) *as well* as the [HTTP RFC 7230](https://tools.ietf.org/html/rfc7230).

## The problems

The core [`http`](https://nodejs.org/api/http.html) module does not validate or sanitize `req.url`.

The legacy [`url.parse()`](https://nodejs.org/api/url.html#url_legacy_url_api) function also allows illegal characters to appear.

The newer [`url.URL()`](https://nodejs.org/api/url.html#url_class_url) constructor will attempt to convert the input into a properly encoded URL with only legal characters. This is better for the general case, however, the official [http spec](https://tools.ietf.org/html/rfc7230#section-3.1.1) states:
> A recipient SHOULD NOT attempt to autocorrect and then process the request without a redirect, since the invalid request-line might be deliberately crafted to bypass security filters along the request chain.

This means a malformed URL should be treated as a violation of the http protocol. It's not something that should be accepted or autocorrected, and it's not something that higher-level code should ever have to worry about.

## The severity

It's tempting to use the [Robustness Principle](https://en.wikipedia.org/wiki/Robustness_principle) as an argument for using the `url.URL` constructor here. Normally, it can be acceptable to diverge from the spec if the result is harmless and beneficial. However, this is not one of those cases. The strictness of URL correctness exists in the spec explicity for security reasons, which should be non-negotiable—especially for a large and respected platform such as Node.js. This is why I created `http-url`.

## Adoption into core

Because of backwards compatibility, it's unlikely that the logic expressed in `http-url` will be incorporated into the core [`http`](https://nodejs.org/api/http.html) module. My recommendation is to either incorporate it into [`http2`](https://nodejs.org/api/http2.html), which is still considered experimental, or as an alternative function in the core [`url`](https://nodejs.org/api/url.html) module. There are many paths forward, but subjecting millions of unsuspecting users to potential security vulnerabilities is not an acceptable practice.

## Unexpected benefits

TODO

