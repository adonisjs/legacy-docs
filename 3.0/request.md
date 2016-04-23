---
title: Request
permalink: request
categories:
	- basics
---

{{TOC}}

Request object contains a lot of useful information for a given HTTP request. By the end of this guide you will know

1. How to extract information for current request.
2. How to get/set cookies and session values.
3. How to flash data for a single request.

## What is a Request Object?

Request object is a sugared layer on top of NodeJs Http request object. It makes it so easy to read information off the request, which is not fun when dealing with raw HTTP requests.

## Request Methods

#### input(key, [defaultValue])

Returns the value from query strings and request body for a given key. If the value does not exists, the default value will be returned.

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

Similar to all, but returns an object with values of defined keys. `null` will become the value when original value for that key does not exists.

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

Opposite of `only`.

```javascript
const data = request.except('_csrf', 'submit')
```

#### get

Returns an object for all query strings.

```javascript
const data = request.get()
```

#### post

Returns request body.

```javascript
const data = request.post()
```

#### fresh

Tells whether request is fresh or not by checking ETag and expires header.

```javascript
request.fresh()
```


#### stale

Opposite of `fresh`

```javascript
request.stale()
```

#### ip

Returns most trusted ip address for a given request. If you are application is behind a proxy server like Nginx, make sure to enable to `http.trustProxy` inside the `config/app.js` file.

```javascript
request.ip()
```

#### ips

Returns an array of ip addresses sorted from most to least trusted.

```javascript
request.ips()
```

#### secure

Tells whether request is server over HTTPS or not.

```javascript
request.secure()
```

#### subdomains

Returns an array of subdomains for a given url. For example- `api.example.org` will have the subdomain as `['api']`.

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

```
request.pjax()
```

#### hostname

Returns request hostname

```javascript
request.hostname()
```

#### url

Returns request current url. It will trim query string and hashes of the url.

```javascript
// url - http://foo.com/users?orderBy=desc&limit=10

request.url()

// returns - http://foo.com/users
```

#### originalUrl

`originalUrl` returns the untouched version of current url.

```javascript
request.originalUrl()
```

#### method

returns request HTTP verb.

```javascript
request.method()
```

#### param(key, [defaultValue])

Returns route param for a given key

```javascript
request.param('id')

// or 

request.param('drink', 'shake')
```

#### params()

Returns all params as an object

```javascript
request.params()
```

#### format
Returns current for a given request. In order to make it work, to need to define [Route Extensions](routing#route-extensions)

```javascript
request.format()
```

#### match(keys...)

Returns a boolean indicating whether the current request url matches any of the given patterns.

```javascript
// url - /user/1

request.match('/user/:id') // true
request.match('/user/all') // false
request.match('/user/all', '/user/(.+)') // true
```

#### hasBody

Returns whether the request has body or not.

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

```
{
	email: ['bar@foo.com', 'baz@foo.com'],
	password: ['secret', 'secret1']
}
```

It seems pretty neat, but it is really hard to process and create multiple users. In order to create users you need to get this data into the right format, which is:

```
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

Adonis can make this process really easy with a single line of code.

#### collect(keys...)

```javascript
const users = request.collect('email', 'password')
const ids = yield User.createMany(users)
```

## Cookies

Cookies are encrypted and signed in Adonis. Which means any tampering to a cookie will make it invalid. 

In order to make your cookie encrypted, make sure to define `APP_KEY` inside your `.env` file. Alternatively you can make use of `ace` to create the key for you.

```bash
./ace generate:key
```

#### cookie(key, [defaultValue])

Returns the cookie value for a given key. Default value is returned when existing value does not exists.

```
request.cookie('cartTotal')
// or
request.cookie('cartTotal' 0)
```

#### cookies

Returns all cookies as an object.

## Content Negotiation

Content Negotiation is a mechanism defined to find the best response type for a given request. The end-user can define the best resource type based upon their requirements.

#### is(keys...)

Returns whether a request is one of the given types.

```javascript
const isPlain = request.is('html', 'plain')
```

#### accepts(keys...)

Returns the best matching response type for a given request.

```javascript
const type = request.accept('json', 'html', 'xml')

switch (type) {
	
	case 'json':
		response.json({hello:"world"})
		break
	case 'html':
		response.send('<h1>Hello world</h1>')
		break
	case 'xml':
		response.xml({hello:"world"})
		break

}

```

## Sessions

Adonis has out of the box support session management. All sessions are long lived based upon their expiry. Also you can create flash messages, which are valid only for the next request.

### Drivers

Adonis ships with `cookie` and `file` driver, which are configured inside `config/session.js` file.

### Methods

#### put(key, value)

```javascript
yield request.session.put('username', 'doe')
// or
yield request.session.put({username: 'doe'})
```

#### get(key, [defaultValue])

Returns the session value for a given key.

```javascript
const username = yield request.session.get('username')
// or
const userId = yield request.session.get('userId', 123)
```

#### all

Returns all session values as an object

```javascript
const sessionValues = yield request.session.all()
```

#### forget(key)

Remove value for a given key

```javascript
yield request.session.forget('name')
```

#### pull(key, [defaultValue])

Pulls and removes the value for a given key. Think of it as calling `get` and `forget` together.

```
const username = yield request.session.pull('username')
```

## Flash Messages

In order to make use of flash messages, make sure to enable the `Flash` middleware by adding the below line to the list of global middleware.

**app/Http/kernel.js**

```javascript
const globalMiddleware = [
	...,
	'Adonis/Middleware/Flash'
]
```

Flash messages are extremely useful when you want to send the errors back on form submission. Let's take the example of user signup.

**app/Http/Controllers/UserController**

```javascript
class UserContoller {

	* signup (request, response) {
		const validation = yield Validator.validate(rules, request.all())
		if (validation.fails()) {
			yield request.withAll().flash()
			response.redirect('back')
		}
	}

}
```

`request.withAll().flash()` will flash all the values submitted by the form back to the signup page.

So you can set them back to the form fields, instead of asking the end-user to re-type everything.

```twig
{{ form.open({method: 'UserController.signup'}) }}
	
	{{ form.text('email', old('email')) }}
	{{ form.password('password', old('password')) }}
	
	{{ form.submit('Create Account') }}

{{ form.close() }}
```


### Flash Methods

#### withAll

Will flash everything from `request.all()`

```javascript
yield request.withAll().flash()
```

#### withOnly(keys...)

Flash values only for defined keys.

```javascript
yield request.withOnly('email').flash()
```

#### withOut(keys...)

Flash all except defined keys

```javascript
yield request.withOut('password').flash()
```

#### with(values)

Flash a custom object

```javascript
yield request.with({error: 'Please fill in all details'})
```

#### andWith(values)

Chainable method to send custom object with request data.

```javascript
yield request
	.withAll()
	.andWith({error: 'Please fill in all details'})
	.flash()
```

#### old(key, [defaultValue])

Access flash values from the last request.

```javascript
request.old('username')
```

## Extending Request

In order to extend request, you can define your own macros. The best time to define macros is after the app is booted.

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
