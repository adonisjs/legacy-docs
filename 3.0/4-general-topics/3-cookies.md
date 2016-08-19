---
title: Cookies
permalink: cookies
description: Creating and reading values of HTTP Cookies in AdonisJs
categories:
- general-topics
---

{{TOC}}

You can easily create and set cookies using the `request` and `response` object sent along with every HTTP request.

Cookies in AdonisJs are encrypted and signed. Which means any tampering to a cookie will make it invalid.

<div class="note">
<strong> Note </strong> In order to make your cookie encrypted, make sure to define <code>APP_KEY</code> inside your <code>.env</code> file. Alternatively you can make use of <code>ace</code> to generate the key for you.</div>

```bash
./ace generate:key
```

## Basic Example

```javascript
Route.get('/', function * (request, response) {
  const pageViews = request.cookie('pageViews') // reading
  pageViews++
  response.cookie('pageViews', pageViews) // writing
})
```


## Reading Cookies

Cookies are read from the request object passed to every route action.

#### cookie(key, [defaultValue])

Returns the cookie value for a given key. The default value is returned when the existing value does not exist.

```javascript
Route.get('/', function * (request, response) {
  const cartTotal = request.cookie('cartTotal')
  // or
  const cartTotal = request.cookie('cartTotal', 0)
})
```

#### cookies

Returns all cookies as an object.

```javascript
Route.get('/', function * (request, response) {
  const cookies = request.cookies()
})
```

## Creating/Deleting Cookies

You write cookies on the response object since they are set when a request finishes.

#### cookie(key, value, [options])

```javascript
Route.get('/', function * (request, response) {
  response.cookie('cartValue', 210)
  // or
  response.cookie('cartValue', 210, {
    httpOnly: true
  })
  response.send('Done!')
})
```

##### options

Options are defined as an object.

| Property       | type    | description                              |
| -------------- | ------- | ---------------------------------------- |
| path           | String  | cookie path                              |
| expires        | Date    | absolute expiration date for the cookie (Date object) |
| maxAge         | String  | relative max age of the cookie from when the client receives it (seconds) |
| domain         | String  | domain for the cookie                    |
| secure         | Boolean | Marks the cookie to be used with HTTPS only |
| httpOnly       | Boolean | Flags the cookie to be accessible only by the web server |
| firstPartyOnly | Boolean | Defines cookie to be used by the same domain only |

#### clearCookie(key)

Removes existing cookie from the response.

```javascript
Route.get('/checkout', function * (request, response) {
  response.clearCookie('cartValue')
  response.send('Order Confirmed')
})
```
