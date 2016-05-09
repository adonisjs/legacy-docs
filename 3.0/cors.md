---
title: CORS
permalink: cors
weight: 1
categories:
- first-steps
---

Cross-Origin resource sharing is a way to allow HTTP requests from different domains. It is very common in AJAX requests where the browser will block all Cross domain requests if they are not enabled or allowed by the server. Read more about [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

In Adonis, CORS are handled by a middleware. Just make sure it is added to the list of global middleware.

##### app/Http/kernel.js

```javascript
const globalMiddleware = [
    ...,
    'Adonis/Middleware/Cors'
]
```

## Config

Settings for CORS is defined inside `config/cors.js` file.

```javascript
module.exports = {
  origin: false,
  methods: 'GET, PUT, POST',
  headers: true,
  exposeHeaders: false,
  credentials: false,
  maxAge: 90
}
```

#### origin

Origin can accept multiple values

1. To disallow all CORS requests simply set it `false`
2. To allow the same origin requests, set it to `true`.
3. You can define comma(,) separated origins.
4. Setting the value to a wildcard `*`, will allow all origins.
5. Finally, you can attach a callback and return one of the above values.

```javascript
origin: function (requestOrigin) {
    return requestOrigin === 'foo'
}
```

#### methods

Http methods/verbs to allow.

#### headers

As origin, headers also accept multiple values

1. To disable all headers set to `false`.
2. To allow all headers defined inside `Access-Control-Request-Headers` set it to `true`.
3. Allow a string of comma(,) separated custom headers. For example - Content-Type, Accepts.
4. Finally, a callback function.

```javascript
headers: function (requestedHeaders) {
}
```

#### exposeHeaders(optional)

Comma separated headers to expose as `Access-Control-Expose-Headers`.

#### credentials (optional)

Allow or disallow `Access-Control-Allow-Credentials` using a boolean value

#### maxAge (optional)

Sets `Access-Control-Allow-Max-Age` to defined max age.