---
title: Middleware
permalink: middleware
description: HTTP middleware documentation for AdonisJs
weight: 4
categories:
- guides
---

{{TOC}}

HTTP Middleware is a layer of methods executed before your Routes actions. They have more than a single use case. For example:

The **body parser** middleware is responsible for parsing request body. Whereas the Auth middleware is used to authenticate the requests and throw `401` Exception whenever the request is not made by an authenticated user.

Middleware has capabilities to:

1. Decorate request object and add values to it.
2. Respond to a given request, without reaching your route action.
3. Or to deny requests by throwing errors.

## Basic Example

```javascript
'use strict'

class Logger {

  * handle (request, response, next) {
    console.log(`Received request on ${request.url()}`)
    yield next
  }

}

module.exports = Logger
```

## Creating A Middleware

Application middleware lives inside the `app/Http/Middleware` directory. Each middleware is a single dedicated **ES2015** Class.

By defining a Class, we open the possibilities of Injecting dependencies into it. Also, each middleware needs to have a `handle` method, which is called automatically by the framework.

Let's make use of ace to create a middleware.

```bash
./ace make:middleware CountryDetector
```

It will create a file called `CountryDetector.js`

##### app/Http/Middleware/CountryDetector.js

```javascript
'use strict'

class CountryDetector {

  * handle (request, response, next) {
    yield next
  }

}

module.exports = CountryDetector
```

`handle` is an ES2015 generator method. It receives `request` and `response` object just like your routes actions. In addition, a middleware also receives a `next` function, which is used to tell the middleware chain to move to the next layer. So whenever you want to pass the request to the next handler, make use of `yield next`.

Let's build upon our `CountryDetector` middleware to detect the visitor country based upon their IP address.

```javascript
'use strict'

const geoip = use('geoip-lite') // npm module

class CountryDetector {

  * handle (request, response, next) {
    const ip = request.ip()
    request.country = geoip.lookup(ip).country
    yield next
  }

}

module.exports = CountryDetector
```

## Register Middleware

Next we need to register this middleware inside `app/Http/kernel.js` file. By registering we guide the AdonisJs server to call this middleware at a specific position.

##### app/Http/kernel.js
```javascript
const globalMiddleware = [
  ...,
  'App/Http/Middleware/CountryDetector'
]
```

Now each request will have a property called `country` attached to it, as we are decorating the request object using the `CountryDetector` middleware.

## Global Middleware

Global middleware are executed on every request. They follow the Queue approach, which means they are executed in the order they are defined in an array.

## Named Middleware

Named middleware are middleware registered with a name. These middleware are not called until you explicitly define them on your routes.

AdonisJs Auth middleware is a great example of named middleware. It is defined as

```javascript
const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth'
}
```

and can be used on routes as

```javascript
Route
  .get('account/:id', 'AccountController.show')
  .middleware('auth')

// or

Route.group('auth-routes', () => {
  Route.get('account/:id', 'AccountController.show')
}).middleware('auth')
```

## Middleware Parameters

Middleware also comes with the added bonus of accepting parameters. You can pass a comma-seperated string for each parameter you wish to use in your middleware class.

##### app/Http/routes.js
```javascript
const Route = use('Route')

Route
  .get('/', 'DefaultController.index')
  .middleware('country:US,AU')
```

##### app/Http/Middleware/CountryDetector.js
```javascript
'use strict'

const geoip = use('geoip-lite') // npm module

class CountryDetector {

  * handle (request, response, next, unitedStates, australia) {
    const ip = request.ip()
    request.country = geoip.lookup(ip).country

    if(request.country == unitedStates || request.country == australia) {
      response.forbidden('Sorry, we do not support your country yet.')
      return
    }

    yield next
  }

}

module.exports = CountryDetector
```
Now each request will have a property called `country` attached to it, but only requests originating outside the United States and Australia will be accepted.
