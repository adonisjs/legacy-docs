---
title: Response
permalink: response
weight: 2
categories:
	- basics
---

{{TOC}}

Just like Request Object, Response Object is also sent along with every HTTP request. By the end of this guide you will know:

1. How to respond back to a given request.
2. How to render views.
3. Redirect request to a different url/route.

## Responding to a request

In Adonis requests get finished when you explicitly respond to them, which means returning a value from the route action will never finish the request.

#### send(body)

Send method will return the body back to the client. You can send different data types and Adonis knows how to parse them and set correct headers for them.

```javascript
response.send('Hello world')
// or
response.send({name: 'doe'})
// or
response.send(1)
```


#### status(code)

Set HTTP status code a given request. Which is `200` by default.

```javascript
response.status(201).send('Created')
```

#### json(body)

Creating a JSON response with correct `Content-type` header.

```javascript
response.json({name: 'doe'})
```


#### jsonp(body)

Creates a JSONP response. It will make use of `callback` defined as the query string or will fallback to `http.jsonpCallback` defined inside `config/app.js` file.

```javascript
response.json({name: 'doe'})
```


#### xml(root, body)

Create a xml response from JSON.

```javascript
response.xml('person', {firstName: 'John'})

/* returns
<?xml version="1.0" encoding="UTF-8"?>
<person>
	<firstName>John</firstName>
</person>
*/
```

#### vary(field)

Adds vary header to response. Understanding the need of `Vary` is quite broad. Check this [link](https://www.fastly.com/blog/best-practices-for-using-the-vary-header) to learn more about it.

```javascript
response.vary('Accept-Encoding')
```


#### header(key, value)

Append header to the response.

```javascript
response.header('Content-type', 'application/json')
```


#### removeHeader(key)

Remove header from the response.

```javascript
response.removeHeader('Accept')
```


#### sendView(path)

Render a nunjucks view.

```javascript
yield response.sendView('welcome')
```

#### download(filePath)

Stream a file for download

```javascript
response.download(Helpers.storagePath('report.xls'))
```

#### attachment(filePath, [name], [disposition=attachment])

Force download file by setting `Content-Disposition`.

```javascript
response.attachment(Helpers.storagePath('report.xls'), 'Daily-Report.xls')
```

#### location(url)

Set Location header for the response. You can also use the `back` keyword to set Location header to the request `Referrer`.

```javascript
response.location('/signup')
```

#### redirect(url, [status=302])

Finish the response by redirecting the request to the given url. 

```javascript
response.redirect('back')
// or
response.redirect('/welcome', 301)
```

#### route(route, data, status)

Redirect to a define route.

```javascript
Route
	.get('/user/:id', '...')
	.as('profile')
	
response.route('profile', {id: 1})

// redirects to /user/1
```

## Cookies

Response object is used to set cookies before ending the response.

#### cookie(key, value, [options])

```javascript
response.cookie('cartValue', '210')
// or
response.cookie('cartValue', '210', options)
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

#### clearCookie(key)

Removes existing cookie from response.

```javascript
response.clearCookie('cartValue')
```


## Descriptive Methods

To keep your code descriptive you can make use of descriptive methods. For Example:

```javascript
response.unauthorized('Login First')
```

is more readable and descriptive than.

```javascript
response.status(401).send('Login First')
```

Below is the list of all descriptive methods and their corresponding Http statuses.

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


## Extending Response

In order to extend response, you can define your own macros. The best time to define macros is after the app is booted.

Same can be done inside `app/Listeners/Http.js`.

#### macro(name, callback)

```javascript
Http.onStart = function () {
	const Response = use('Response')
	
	Response.macro('sendStatus', function (status) {
		this.status(status).send(status)
	})
}
```
