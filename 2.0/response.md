# Response

The response object is also sent along with every single HTTP request and has a handful of methods to respond properly from a given request.

- [Making Response](#making-response)
- [Descriptive Methods](#descriptive-methods)
- [Cookies](#cookies)
- [Redirects](#redirects)
- [Making Views](#making-views)

## Making Response

For the most basic response, you can make use of send method

``` javascript,line-numbers
* index (request, response) {
  response.send("Hello world")
}
```

#### send (body)

``` javascript,line-numbers
response.send("Hello world")
```

#### status (statusCode)

``` javascript,line-numbers
response.status(200).send("Hello world")
```

#### json (body)

``` javascript,line-numbers
response.json({drink:"coffee"})
```

#### jsonp (body)

``` javascript,line-numbers
response.jsonp({drink:"coffee"})
```

#### vary (field)

adds vary header to response

``` javascript,line-numbers
response.vary('Accept')
```

#### header (key, value)

adds key/value pair to response header

``` javascript,line-numbers
response.header('Content-Type', 'application/json')
```

## Descriptive Methods

Response object has support for descriptive methods, which will auto set the response status for you.

<div class="__note">

​	<strong> Note: </strong> Descriptive methods have been introduced in version `2.0.9`.

</div>

``` javascript,line-numbers
response.ok('Done')
// is equivalent to response.status(200).send('Done')
response.unauthorized('Login First')
// is equivalent to response.status(401).send('Login First')
```



Below is the list of supported methods and their correspoding http statuses.

| method                       | http response status |
| ---------------------------- | -------------------- |
| continue                     | 100                  |
| switchingProtocols           | 101                  |
| ok                           | 200                  |
| created                      | 201                  |
| accepted                     | 202                  |
| nonAuthoritativeInformation  | 203                  |
| noContent                    | 204                  |
| resetContent                 | 205                  |
| partialContent               | 206                  |
| multipleChoices              | 300                  |
| movedPermanently             | 301                  |
| found                        | 302                  |
| seeOther                     | 303                  |
| notModified                  | 304                  |
| useProxy                     | 305                  |
| temporaryRedirect            | 307                  |
| badRequest                   | 400                  |
| unauthorized                 | 401                  |
| paymentRequired              | 402                  |
| forbidden                    | 403                  |
| notFound                     | 404                  |
| methodNotAllowed             | 405                  |
| notAcceptable                | 406                  |
| proxyAuthenticationRequired  | 407                  |
| requestTimeout               | 408                  |
| conflict                     | 409                  |
| gone                         | 410                  |
| lengthRequired               | 411                  |
| preconditionFailed           | 412                  |
| requestEntityTooLarge        | 413                  |
| requestUriTooLong            | 414                  |
| unsupportedMediaType         | 415                  |
| requestedRangeNotSatisfiable | 416                  |
| expectationFailed            | 417                  |
| unprocessableEntity          | 422                  |
| tooManyRequests              | 429                  |
| internalServerError          | 500                  |
| notImplemented               | 501                  |
| badGateway                   | 502                  |
| serviceUnavailable           | 503                  |
| gatewayTimeout               | 504                  |
| httpVersionNotSupported      | 505                  |

## Cookies

You can also attach cookies to your response

#### cookie (key, value, [, options])

``` javascript,line-numbers
response.cookie('name', 'value')
// or
response.cookie('name', 'value', options)
```

**options**

| Property       | type    | description                              |
| -------------- | ------- | ---------------------------------------- |
| path           | String  | cookie path                              |
| expires        | Date    | absolute expiration date for the cookie (Date object) |
| maxAge         | String  | relative max age of the cookie from when the client receives it (seconds) |
| domain         | String  | domain for the cookie                    |
| secure         | Boolean | Marks the cookie to be used with HTTPS only |
| httpOnly       | Boolean | Flags the cookie to be accessible only by the web server |
| firstPartyOnly | Boolean | Defines cookie to be used by the same domain only |

#### clearCookie (key [,options])

removes existing cookie from response

``` javascript,line-numbers
response.clearCookie('name')
```

## Redirects

Redirecting to a different path is a common requirement for a web application. As Adonis is a tightly integrated framework, you can leverage out of box redirection mechanisms.

#### redirect (url)

``` javascript,line-numbers
response.redirect('http://foo.com')
```

#### route

redirects to a given route

``` javascript,line-numbers
response.route('/user/:id', {id: 1})
```

or you can use the name for a named route.

``` javascript,line-numbers
Routes
.get('/user/:id','UsersController.show')
.as('profile')
```

``` javascript,line-numbers
response.route('profile', {id: 1})
```

## Making Views

Response class includes a helper to make views using response object.

#### view (path [, data])

``` javascript,line-numbers
const view = yield response.view('index')
response.send(view)

// or

const view = yield response.view('profile', {username: 'foo'})
response.send(view)
```



#### sendView (path [, data])

sendView is similar to `view` method, instead it will send the response immediately and you will not have to call `send` method manually.

``` javascript,line-numbers
const view = yield response.sendView('index')
// or
const view = yield response.sendView('profile', {username: 'foo'})
```