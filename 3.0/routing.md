---
title: Routing
permalink: routing
categories:
	- basics
---

{{TOC}}

This guide will get you started with the Routing concepts of Adonis. By the end of this guide you will know.

1. How to define individual routes.
2. Making use of route renderer.
3. Attaching middleware to routes. 
4. Grouping routes under a group to share common settings.
5. Routing conventions and supported verbs.


Routing is a concept of defining url's and their corresponding actions. So when a user visits a url, you know how to respond back to them.

## Defining Routes

Routes are defined inside `app/Http/routes.js` file. It is a good practice to keep this file clean and move all required logic to different files/directories.

```javascript
// importing the route provider
const Route = use('Route')

Route.get('/about', function * (request, response) {
	
	response.send('You are looking at the about page')

})
```

If you will open `http://localhost:3333/about` in the browser, you will be greeted with the response you sent using the `send` method.

## Http Verbs

Http has verbs to communicate between the client and the server. `Route.get` makes use of the `GET` verb.

Like `GET` they are so many other verbs, which makes it so easier to define readable and short urls. You can read more about Http Verbs [here](http://www.restapitutorial.com/lessons/httpmethods.html).


### Supported Verbs

| Verb | Method |
|-------|--------|
| GET | Route.get |
| POST | Route.post |
| PUT | Route.put |
| PATCH | Route.patch |
| DELETE | Route.delete |


Above are the commonly used verbs you would ever need to use. For less popular verbs you can make use of the `route` method.


#### route (url, verbs, action)

```javascript
const Route = use('Route')

Route.route('/', 'COPY', function * (request, response) {

})

// or

Route.route('/', ['COPY', 'MOVE'], ...)
```

### Multiple verbs

You can also respond using the same action for multiple verbs on a given url.

#### match (verbs, url, action)

```javascript
Route.match(['GET', 'POST'], '/', function * (request, response) {

})
```

#### any (url, action)

```javascript
Route.any('/', function * (request, response) {

})
```

## Route Parameters

Static routes are good for static websites. In order to build dynamic web applications, routes needs to be more dynamic and powerful.

### Required Parameters

```javascript
Route.get('/make/:drink', function * (request, response) {
	const drink = request.param('drink')
	response.send(`Order for ${drink} has been placed.`)
})
```

`:drink` is a dynamic segment for your url. Which means the end user can pass anything after `/make`.

A url with `/make/coffee` will respond with, **Order for coffee has been placed.**


### Optional Parameters

You can also define optional parameters which can be replaced with defaults. In order to define an optional parameter, you need to append a `?` to it.

```javascript
Route.get('/make/:drink?', function * (request, response) {
	const drink = request.param('drink', 'shake')
	response.send(`Order for ${drink} has been placed.`)
})
```

Now as `:drink?` is optional, we ask the `param` method to return the default value when the actual value for `drink` does not exists.

1. Here `/make` will respond with **Order for shake has been placed**.
2. And `/make/coffee` will respond with **Order for coffee hash been placed**.



## Route Extensions

When building beautiful REST API's, it is very important to be explicit with your urls. Route extensions is a step towards that goal.

#### as (formats, [strict=false])

```javascript
Route
	.get('/users', 'UserController.index')
	.formats(['json', 'xml'])
```

`as` method helps you in defining url's with multiple extensions. This is helpful when you have an API, that can return both `json` and `xml`. 

Above route will respond to 3 different urls using the same action.

1. /users
2. /users.json
3. /users.xml

Setting `strict=true` will not define the default url and you will end up with only 2 routes.

1. /users.json
2. /users.xml

Inside your action you can pull the current format and respond accordingly.

**app/Http/Controllers/UserController.js**
```javascript
class UserController {

	* index (request, response) {
		const format = request.format()
		
		switch (format) {
			case 'json':
				response.json(...)
				break
			case 'xml':
				response.xml('...')
				break
			default:
				yield response.sendView('users')
		}
		
	}

}
```

Super Powerful! It is so easy to write content aware applications using the Route extensions.

## Named Routes

No doubt Routes are defined inside `app/Http/routes.js` file, but they are used everywhere. For example-

1. Inside a view, to create navigation bar.
2. Inside Controllers, to redirect to a different url, etc.

As your application will grow, you will find yourself changing route url's quite often. 

Now changing them inside the routes file is quite easy, but finding their references inside the views and controllers is not something you are going to enjoy.

#### as (name)

```javascript
Route
	.get('/user/:id', 'UserController.show')
	.as('profile')
```

`as` method will give a unique name/identity to a route. So that you can use it with it's name instead of the url.

### View Helpers

#### linkTo (name, text, [data], [target])

`linkTo` is a global view only function to create an anchor tag for a named route.

```twig
{{ linkTo('profile', 'View Profile', {id: 1}) }}
{{ linkTo('profile', 'View Profile', {id: 1} , '_blank') }}

// returns
<a href="/user/1"> View Profile </a>
<a href="/user/1" target="_blank"> View Profile </a>
```

#### route([data])

`route` is a filter which can be used when you just want the link to a route, instead of a complete anchor tag.

```twig
<form action="{{ 'profile' | route({id: 1}) }}">
...
</form>
```


## Route Middleware

There is a dedicated guide on [Middleware](middleware). In this topic you will learn how to assign a single or multiple middleware to a route.

```javascript
Route
	.get('/users', '...')
	.middleware('auth')

// or
Route
	.get('/users', '...')
	.middleware('auth', 'acl')
```

Middleware are called in sequence before the route action is called.

## Groups

Groups are helpful when you want to define a set of settings to a bunch of routes without re-typing the same thing again and again.

Let's take a classic example of `middleware`.

```javascript
Route
	.get('/users', '...')
	.middleware('auth')

Route
	.get('/accounts', '...')
	.middleware('auth')
```

This list will grow quickly, where you have repeat yourself by assigning the `auth` middleware to each route. Instead you should group them together inside a unique group.

#### group(name, closure)

```javascript
Route.group('restricted', function () {
	Route.get('/users', '...')
	Route.get('/accounts', '...')
}).middleware('auth')
```

### Group extensions

Groups can be used for a lot more than just assigning middleware.

#### prefix(pattern)

```javascript
Route.group('v1', function () {
	
	Route.get('/users', '...')

}).prefix('/api/v1')
```

Above route will have a url `/api/v1/users`.

#### domain(domain)

You can also define domain specific routes.

```javascript
Route.group('v1', function () {

	// your routes

}).domain('api.example.org')
```

Above route will only work, when the request base url is `api.example.com`.

Also you can define dynamic domains. Do make sure you have to enable wildcards on your server to have dynamic subdomains.

```javascript
Route.group('v1', function () {

	Route.get('/account', function * (request, response) {
		const user = request.param('user')
	})

}).domain(':user.example.org')
```

This way you can have subdomains to each user. For example- **virk.example.org** or **joe.example.org**

## Route Renderer

Route renderer is a step towards eliminating the dead code. Every application has a requirement to render some dumb views.

Now we call them **dumb views**, because there is no logical processing required to render these views. For example-

1. An about page.
2. A welcome screen.
3. Contact page to display a form.

In order to render above views, all you need is to send html back to the browser.

### Long way

```javascript
Route
	.get('/about', 'AboutController.render')
```

```javascript
class AboutController {
	
	* render (request, response) {
		yield response.sendView('about')
	}

}
```

It's all dead code. Just in order to render a view, you have to do a lot of work and create Controllers with single methods inside them.

### Using Renderer

```javascript
Route.on('/about').render('about')
Route.on('/contact').render('contact')
Route.on('/').render('welcome')
```

Just a line of code, to map a view to a url. 

Bonus! `render` method will pass the current request to the view, so if required you can make fetch information of it.

**resources/views/contact.nunjucks**
```twig
// request url - /contact?email=foo@bar.com

<input type="email" value="{{ request.input('email') }}" />
```

## Form Method Spoofing

We learning about different HTTP verbs, but unfortunately standard HTML forms does not allow anything over `GET` and `POST`. 

Form method spoofing makes it easier to define the verb as a query string.

```twig
<form method="POST" action="/create?_method=PUT">
</form>
```

`_method` takes precedence over the actual HTTP verb, so in above case Adonis will call the route action defined with `PUT` verb.

## FAQ'S

Routing in Adonis is broad and with time you will understand all of the above concepts and their right usages.

Here let us share what we think are the best practices for defining routes.

1. Always try to keep your routes file clean and move all the logic inside controllers.
2. Route closures are handy when you want to process very little information, but make sure you do not use them quite often.
3. Make use of [Resourceful Routes](controllers#resourceful-routes), whenever possible while creating CRUD applications.
4. Try to keep your urls short and simple. This [video](https://vimeo.com/17785736) may help.
