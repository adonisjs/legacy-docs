---
title: Request
permalink: request
description: Handling HTTP requests
weight: 2
categories:
- guides
---

{{TOC}}

The request object is a sugared layer on top of [Node.js HTTP request object](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_class_http_server). It makes it so easy to read information off the request, which is not fun when dealing with raw HTTP requests.

`request` object is passed as the first argument to all Controller's methods and Route closures.

## Basic Example

```javascript
Route.get('/posts', function * (request, response) {
    request.url() // get url
    request.all() // get request body and query string
})
```

## Request Methods

#### input(key, [defaultValue])

Returns the value of query strings and request body for a given key. If the value does not exist, the default value will be returned.

```javascript
const name = request.input('name')
const subscribe = request.input('subscribe', 'yes')
```

#### all

Returns all values extracted from query strings and the request body.

```javascript
const data = request.all()
```

#### only(keys...)

Similar to all, but returns an object with values of defined keys. `null` will become the value when the original value for that key does not exist.

```javascript
const data = request.only('name', 'email', 'age')

// returns
{
  name: '..',
  email: '..',
  age: '..'
}
```

#### except(keys...)

Opposite of `only()`.

```javascript
const data = request.except('_csrf', 'submit')
```

#### get

Returns a serialized object of query string.

```javascript
const data = request.get()
```

#### post

Returns a serialized object of request body.

```javascript
const data = request.post()
```

#### fresh

Tells whether the request is fresh or not by checking ETag and expires header.

```javascript
request.fresh()
```


#### stale

Opposite of `fresh()`

```javascript
request.stale()
```

#### ip

Returns most trusted IP address for a given request. If you are application is behind a proxy server like Nginx, make sure to enable `http.trustProxy` inside the `config/app.js` file.

```javascript
request.ip()
```

#### ips

Returns an array of IP addresses sorted from most to least trusted.

```javascript
request.ips()
```

#### secure

Tells whether the request is served over HTTPS or not.

```javascript
request.secure()
```

#### subdomains

Returns an array of subdomains for a given URL. For example, `api.example.org` will have the subdomain as `['api']`.

```javascript
request.subdomains()
```

#### ajax

Returns whether the current request is made using Ajax call or not.

```javascript
request.ajax()
```

#### pjax

[Pjax](https://www.google.co.in/search?q=Pjax#q=What+is+Pjax) is a hybrid `ajax` request.  If you are from Ruby on Rails world, it is quite similar to Turbolinks.

```javascript
request.pjax()
```

#### hostname

Returns request hostname

```javascript
request.hostname()
```

#### url

Returns request current URL. It will trim query string.

```javascript
// url - http://foo.com/users?orderBy=desc&limit=10

request.url()

// returns - http://foo.com/users
```

#### originalUrl

`originalUrl()` returns the untouched version of current URL.

```javascript
request.originalUrl()
```

#### method

returns request HTTP verb.

```javascript
request.method()
```

#### param(key, [defaultValue])

Returns route param for a given key.

```javascript
request.param('id')

// or 

request.param('drink', 'shake')
```

#### params()

Returns all params as an object.

```javascript
request.params()
```

#### format
Returns current format for a given request. In order to make it work, to need to define [Route Formats](routing#route-formats).

```javascript
request.format()
```

#### match(keys...)

Returns a boolean indicating whether the current request URL matches any of the given patterns.

```javascript
// url - /user/1

request.match('/user/:id') // true
request.match('/user/all') // false
request.match('/user/all', '/user/(.+)') // true
```

#### hasBody

Returns whether the request has the body or not.

```javascript
request.hasBody()
```

## Headers

You can make use of the below methods to read request headers.

#### header(key, [defaultValue])

Returns value for a given header key or returns the default value.

```javascript
const csrfToken = request.header('CSRF-TOKEN')
// or
const time = request.header('x-time', new Date().getTime())
```

#### headers

Returns all headers as an object.

```javascript
request.headers()
```


## Request Collection

A common requirement for web applications is to deal with multiple records for a single entity. For example:

Creating multiple new users from an HTML form.

```twig
<form method="POST" action="/users">
  <h2> User 1 </h2>
  <input type="email" name="email[]" />
  <input type="password" name="password[]" />

  <h2> User 2 </h2>
  <input type="email" name="email[]" />
  <input type="password" name="password[]" />
  
  <button type="submit> Create Users </button>
</form>
```

Submitting the above form will result in data with below format.

```json
{
  email: ['bar@foo.com', 'baz@foo.com'],
  password: ['secret', 'secret1']
}
```

It seems pretty neat, but it is really hard to process and create multiple users. In order to create users you need to get this data into the right format, which is:

```json
[
  {
    email: 'bar@foo.com',
    password: 'secret'
  },
  {
    email: 'baz@foo.com',
    password: 'secret1'
  } 
]
```

AdonisJs can make this process really easy with a single line of code.

#### collect(keys...)

```javascript
const users = request.collect('email', 'password')
const ids = yield User.createMany(users)
```

## Content Negotiation

Content Negotiation is a way to find the best response type for a given request. The end-user can make use of HTTP headers to define the best response they are expecting from the server.

#### is(keys...)

Returns whether a request is one of the given types. This method will parse the request `Content-type` header.

```javascript
const isPlain = request.is('html', 'plain')
```

#### accepts(keys...)

`accepts` will header the `Accept` header to negotiate the best response type for a given HTTP request.

```javascript
const type = request.accepts('json', 'html')

switch (type) {
  
  case 'json':
    response.json({hello:"world"})
    break
  case 'html':
    response.send('<h1>Hello world</h1>')
    break
}

```

## Extending Request

In order to extend request object, you can define your own macros. The best time to define macros is after the app is booted.

Same can be done inside `app/Listeners/Http.js`.

#### macro(name, callback)

```javascript
Http.onStart = function () {
  const Request = use('Request')
  
  Request.macro('cartValue', function () {
    return this.cookie('cartValue', 0)
  })
}
```

and later you can make use of it.

```javascript
Route.get('/cart', function * (request, response) {
  const cartValue = request.cartValue()
})
```
