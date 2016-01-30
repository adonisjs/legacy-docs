# Routing

Routes help you in exposing urls to outside world that can be used to interact with your application. Adonis has rich routing vocabulary which makes it easier for you to define routes and their actions.

- [Basic routing](#basic-routing)
  - [Route closures](#route-closures)
  - [HTTP Verbs](#http-verbs)
  - [Multiple verbs](#multiple-verbs)
  - [Named routes](#named-routes)
  - [Route Extensions](#route-extensions)
- [Route parameters](#route-parameters)
  - [Required parameters](#required-parameters)
  - [Optional parameters](#optional-parameters)
- [Route controllers](#route-controllers)
- [Middleware](#middleware)
- [Groups](#groups)
  - [prefix](#prefix)
  - [domain](#domain)
- [Form Method Spoofing](#form-method-spoofing)

## Basic routing

You start by defining your routes inside [`app/Http/routes.js`](https://github.com/adonisjs/adonis-app/blob/master/app/Http/routes.js) file by requiring `Route` provider. Always try to keep your routes file clean and never include any application logic inside this file.

#### Route closures

``` javascript,line-numbers
const Route = use('Route')

Route.get('/', function * () {

  // handle request

})
```

`Closures` are callbacks and oftenly accepted as the second parameter to your route definition. Note here route closure has a special `*` symbol after function keyword. This defines a [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) in ES6. You won't have to worry much about generators here, just remember they make it easier to write async code by removing callbacks.

#### HTTP verbs

HTTP verbs are methods defined while making an HTTP request.Adonis has support for all request methods.

##### get request

``` javascript,line-numbers
Route.get('/', function * () {

  // handle request

})
```

##### post request

``` javascript,line-numbers
Route.post('/', function * () {

  // handle request

})
```

##### put request

``` javascript,line-numbers
Route.put('/', function * () {

  // handle request

})
```

##### delete request

``` javascript,line-numbers
Route.delete('/', function * () {

    // handle request

})
```

##### patch request

``` javascript,line-numbers
Route.patch('/', function * () {

    // handle request

})
```

#### Multiple verbs

You can respond with the same action for multiple requests with following methods.

##### match

``` javascript,line-numbers
Route.match(['get','post'], '/', function * () {

})
```

##### any

any method will include **get,post,put,patch,delete,options**

``` javascript,line-numbers
Route.any('/', function * () {

})
```

#### Named Routes

Think of named routes as giving a unique name to a given route. It is helpful when you want to generate fully qualified URL to routes with a shortcut.

``` javascript,line-numbers
Route.get('/users/profile/:id', ... ).as('profile')
```

Let's say you want to reference the above route inside a different file, so there are multiple ways of doing it.

##### Bad

``` markup,line-numbers
/users/profile/1
```

##### Better

``` javascript,line-numbers
Route.url('/users/profile/:id', {id:1})
```

##### Good

``` javascript,line-numbers
Route.url('profile', {id:1})
```

Named routes give you the power to make use of the last example, which is readable and also keeps your code [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) as after changing the initial route definition you won't have to change a single line of code elsewhere.



#### Route Extensions

Route extensions helps in making decision on how to reply for a given route. Think of it as registering verbose url's with `.html`, `.json` or `.xml` extensions and then inside your controllers, you can make decisions on what to send based upon the route extension.

``` javascript,line-numbers
Route.get('/users', 'UsersController.index').formats(['json', 'html'])
```

By registering the above route, you will be able to handle requests on 3 different urls.

1. /users
2. /users.json
3. /users.html



All of the above routes will be handled by `UsersController.index` method, and there you can make decision on how to respond from your controller.

``` 
// app/Http/Controller/UsersController

* index (request, response) {
  const format = request.format()
  	
  switch (format) {
  	case 'html':
    	yield response.sendView('users')
        break
    case 'json':
    	response.send({key: value})
        break
  }  
}
```

You can think of it as an companion to [Content Negotiation](/request#content-negotiation).



## Route parameters

Route parameters are transparent dynamic segments on URL. With Adonis, you can define optional and required parameters and get values for them in route actions.

#### Required parameters

``` javascript,line-numbers
Route.get('/make/:drink', function * (request, response) {
  const drink = request.param('drink')
  response.send(`I will make ${drink} for you`)
})
```

Here `:drink` is a required parameter on the route that needs to be present to invoke defined action.

#### Optional parameters

``` javascript,line-numbers
Route.get('/make/:drink?', function (request, response) {
  const drink = request.param('drink', 'coffee')
  response.send(`I will make ${drink} for you`)
})
```

`?` defines optional parameters, also `param` method accepts another argument that is the default value for param that does not exist.`

## Route controllers

`Closures` are good but not great, to keep your routes file clean it's always good practice to make use of controllers. Controllers are used in the combination of `Controller.method` as string.

``` javascript,line-numbers
Route.get('/', 'HomeController.index')
```

Above route will look for `index` method inside `HomeController` which is an ES6 class.

``` javascript,line-numbers
// app/Http/Controllers/HomeController.js

class HomeController {

  * index (request, response) {
    response.send("Hello World! ")
  }

}

module.exports = HomeController
```

## Middleware

Expectations of middleware should be satisfied before a request can reach your route actions. You can read more about [Middleware](middleware) as they make it super easy to write maintainable and DRY code.

To attach middleware to your route, you can make use of `middlewares` method.

``` javascript,line-numbers
Route.get('/profile', 'ProfileController.show').middlewares(['auth'])
```

## Groups

Think of them as grouping your routes under common settings or configuration without declaring the same thing on individual routes.

``` javascript,line-numbers

Route.group('name', function () {

  // all routes under this callback are part of this group

})

```

#### prefix

prefix group of routes with defined path.

``` javascript,line-numbers
Route.group('version1', function () {

  Route.get('/', ...)

}).prefix('/v1')
```

#### domain

register group of routes for a given domain only

``` javascript,line-numbers
Route.group('blog', function () {

  Route.get('/post', ...)

}).domain('blog.example.org')
```

#### middleware

middleware can also be attached to a group of routes

``` javascript,line-numbers
Route.group('blog', function () {

  Route.get('/post', ...)

}).middlewares(['auth'])
```



## Form Method Spoofing

HTML form tags do not support all verbs apart from `GET` and `POST`.
So, when using `PUT`, `PATCH` or `DELETE` routes you will need to add a query string to the form's action that the router will use to know which verb you are using.

``` html,line-numbers

<form method="POST" action="/create?_method=PUT">
</form>

```