## CORS

Cross-origin resource sharing is a way to allow HTTP requests coming in from different domain. It is very common in AJAX requests where the browser will block all Cross domain requests if they are not enabled or allowed by the server. Read more about [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)

Adonis ships a lean middleware that can be used on routes to enable CORS.

### For all routes

Define CORS as a `global middleware` inside `app/Http/kernel.js` file to enable it for all routes.

### For specific routes

Add it to the list of `namedMiddleware` and use it on specific routes.

```
// app/Http/kernel.js
const namedMiddleware = {
  Cors: 'App/Http/Middleware/Cors'
}
```

```javascript,line-numbers
Route.group('cors', function () {

}).middleware(['Cors'])
```

### Settings

`config/cors.js` has a list of options can be used to configure CORS.

```javascript,line-numbers
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
1. to disable CORS simply set it to `false`.
2. to allow the same origin from where request is received set it to `true`.
3. also you can define custom origins with the option of wildcard `*`.
4. finally you can attach a function to origin which will get the request origin as an argument.

```javascript,line-numbers
origin: function (requestOrigin) {
}
```

#### methods
Http methods/verbs to allow.

#### headers
As origin, headers also accept multiple values
1. to disable all headers set to `false`.
2. to allow all headers defined inside `Access-Control-Request-Headers` set it to `true`.
3. allow custom headers as `Content-Type, Accepts`.
4. attach a function and return value to be used for headers.

```javascript,line-numbers
headers: function (requestedHeaders) {
}
```

#### exposeHeaders <span>( optional )</span>
Comma separated headers to expose as `Access-Control-Expose-Headers`.

#### credentials <span>( optional )</span>
Allow or disallow `Access-Control-Allow-Credentials` using a boolean value

#### maxAge <span>( optional )</span>
Sets `Access-Control-Allow-Max-Age`
