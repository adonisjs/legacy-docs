---
title: Middleware
permalink: middleware
weight: 6
categories:
	- basics
---

Middleware is a layer of classes executed before your Routes actions.

Middleware has more than a single use case. Official middleware shipped with Adonis are used for various reasons. For example-

The body parser middleware is responsible for parsing request body and handle file uploads. Whereas the Auth middleware is used to authenticate request and throw `401` Exception whenever the request is not made by an authenticated user.

Middleware has capabilities to:

1. Decorate request object and add values to it.
2. Respond to a given request, without reaching your route action.
3. Or to deny requests by throwing errors.

## Creating A Middleware

Application middleware lives inside the `app/Http/Middleware` directory. Each middleware is a single dedicated Es6 class.

By defining a class, we open the possibilities of Injecting dependencies into it. Also each middleware needs to have a `handle` method, which is called automatically by Adonis.

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
```

`handle` is a Es6 generator method and receive `request` and `response` object just like your routes actions. 

In addition a middleware also receives a `next` function, which is used to tell the middleware chain to move to the next layer. So whenever you want to pass the request to the next handler, make use of `yield next`.

Let's build upon our `CountryDetector` middleware to detect the visitor country based upon their ip address.

```javascript
'use strict'

class CountryDetector {

  * handle (request, response, next) {
	  const ip = request.ip()
	  request.country = geoip.lookup(ip).country
	  yield next
  }

}
```

## Register Middleware

Next we need to register this middleware inside `app/Http/kernel.js` file. By registering we guide the Adonis server to call this middleware at a specific position.

##### app/Http/kernel.js
```javascript
const globalMiddleware = [
	...,
	'App/Http/Middleware/CountryDetector'
]
```

Now each request will have a property called `country` attached to it, since we are decorating the request object using the `CountryDetector` middleware.

## Global Middleware

Global middleware are executed on every request. They follow the QUEUE approach, which means they are executed in the order they are registered inside an array.

## Named Middleware

Named middleware are middleware registered with a name. These middleware are not called until we explicitly define them on our routes.

Adonis Auth middleware is a great example of named middleware. It is defined as 

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
```

