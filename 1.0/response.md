# Response

Like `request` object , response object is also passed to request `Closure` and `Controller method` . Using response you can build responses following [RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) specs.

- [Making response](#making-response)
- [Cookies](#cookies)
- [Redirects](#redirects)
    - [to url](#to-url)
    - [to routes](#to-routes)
    - [to named routes](#to-named-routes)
- [Making views](#making-views)


## Making response

```javascript,line-numbers
class UserController{

  *show(request,response){

    let user = User.find(1)
    response.status(200).send(user.attributes)

  }

}
```

alternatively you can make use of `ok` method which automatically sets 200 status for you.

### ok

```javascript,line-numbers
response.ok('Hello world')
```

is equivalent to

```javascript,line-numbers
response.status(200).send('Hello world')
```  

### header

setting response header using key/value pair

```javascript,line-numbers
response.header('time',new Date())
```

### json

sending a response with correct JSON headers.

```javascript,line-numbers
response.json({foo:'bar'})
```

is equivalent to

```javascript,line-numbers
response.header('Content-type','application/json').send({foo:'bar'})
```

### jsonp

sending formatted JSONP response.

```javascript,line-numbers
response.jsonp({foo:'bar'})
```

### download

output file content to the browser.

```javascript,line-numbers
response.download(path_to_file)
```

### attachment

output file content to the browser with force download.

```javascript,line-numbers
response.attachment(path_to_file)
```

### redirect

redirecting user to defined URL.

```javascript,line-numbers
response.redirect(url)
```

You can use descriptive names as functions to create [RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) specific response.

#### unauthorized

```javascript,line-numbers
response.unauthorized('Unauthorised request')
```

will output

```javascript,line-numbers
response.status(401).send('Unauthorised request')
```

#### movedPermanently

```javascript,line-numbers
response.movedPermanently()
```

#### paymentRequired

```javascript,line-numbers
response.paymentRequired()
```

#### notFound

```javascript,line-numbers
response.notFound()
```

and so on.


## Cookies

All cookies are signed and encrypted before they are sent to the browser.

<div class='__note'>
	<p>
		Make sure to define **APP_KEY** for encryption otherwise all cookies will be sent as plain text.
	</p>
</div>

#### cookie
```javascript,line-numbers
response.cookie('foo','bar').send('Created foo cookie')
// or
response.cookie('foo', 'bar', options).send('Created foo cookie with options')
```

**options**

| Property | type | description |
|-----------|-------|------------|
| path      | String | cookie path |
| expires      | Date | absolute expiration date for the cookie (Date object) |
| maxAge      | String | relative max age of the cookie from when the client receives it (seconds) |
| domain      | String | domain for the cookie |
| secure      | Boolean | Marks the cookie to be used with HTTPS only |
| httpOnly      | Boolean | Flags the cookie to be accessible only by the web server |
| firstPartyOnly | Boolean | Defines cookie to be used by the same domain only |


#### clearCookie
```javascript,line-numbers
response.clearCookie('foo').send('Cleared foo cookie')
```


## Redirects

Redirecting to a different path is a common requirement for a web applications. As Adonis is a tightly integrated framework, you can leverage out of box redirection mechanisms.

### to URL

```javascript,line-numbers
response.redirect(full_url)
```

### to routes

```javascript,line-numbers
response.route('/user/:id',{id:1})
```

### to named routes

first we will define a named route

```javascript,line-numbers
Routes
.get('/user/:id','UsersController.show')
.as('profile')
```

later you can redirect to named route as

```javascript,line-numbers
response.route('profile',{id:1})
```


## Making views

You can make views directly from the response object. Adonis render views asynchronously, so you have to yield them as an ES6 generator.

```javascript,line-numbers```
const usersView = yield response.make('users.html')
response.ok(usersView)
```
