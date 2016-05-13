---
title: Cookie
permalink: cookies
weight: 9
categories:
- getting-started
---

Cookies in AdonisJs are encrypted and signed. Which means any tampering to a cookie will make it invalid. 

In order to make your cookie encrypted, make sure to define `APP_KEY` inside your `.env` file. Alternatively you can make use of `ace` to generate the key for you.

```bash
./ace generate:key
```

## Reading Cookies

Cookies are read from the request object passed with every route action.

#### cookie(key, [defaultValue])

Returns the cookie value for a given key. Default value is returned when existing value does not exists.

```javascript
Route.get('/', function * (request, response) {
  const cardTotal = request.cookie('cartTotal')
  // or
  const cardTotal = request.cookie('cartTotal', 0)
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

You write cookies on the response object, since they are set when a request finishes.

#### cookie(key, value, [options])

```javascript
Route.get('/', function * (request, response) {
  response.cookie('cartValue', 210)
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

Removes existing cookie from response.

```javascript
Route.get('/', function * (request, response) {
  response.clearCookie('cartValue')
  response.send('Cleared Cookie')
})
```