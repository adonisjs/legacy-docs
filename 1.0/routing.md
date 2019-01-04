
# Routing

Routing empowers you to divide your application into multiple logical endpoints and is the most powerful feature on the web.
With adonis you define your routes inside `app/Http/routes.js` file , which is loaded by `bootstrap/http.js` file.


- [Basic Routing](#basic-routing)
    - [Required Parameters](#required-parameters)
    - [Optional Parameters](#optional-parameters)
    - [Closures](#closures)
    - [Controller Methods](#controller-methods)
- [Route Middleware](#route-middleware)
- [Named Routes](#named-routes)
- [Route Groups](#route-groups)
    - [Prefixing routes](#prefixing-routes)
    - [Attaching middleware](#attaching-middleware)
    - [Sub-domain routing](#domain-specific-routes)
- [Making Url](#making-url)
- [Throwing Exceptions](#throwing-exceptions)


## Basic Routing

Routing helps in you in defining url's to your web application and attach methods to respond for incoming requests. For most basic routes you can define `Closures` as routes handlers.



#### http verbs

```javascript,line-numbers
Route.get('/', function * () {
  return 'Hello world.'
})

Route.post('/', function * () {
  return 'Hello world.'
})

Route.put('/', function * () {
  return 'Hello world.'
})

Route.patch('/', function * () {
  return 'Hello world.'
})

Route.delete('/', function * () {
  return 'Hello world.'
})
```

#### multiple verbs

```javascript,line-numbers
Route.match(['get','post'], '/', function * () {

})

Route.any('bar', function * () {

})

```

Attached closures to the above routes are ES6 generators , make it easier for you write non-blocking code without callbacks.


### Required Parameters

```javascript,line-numbers
Route.get('make/:drink',function * (request,response) {

  const drink = request.param('drink')
  return `Surely, i will make ${drink} for you`

})
```

Above you made use of `param` method on `request` object that accepts a key for which value to be returned.
To get all params, you can call `request.params()`


### Optional Parameters

```javascript,line-numbers
Route.get('make/:drink?',function * (request,response) {

  const drink = request.param('drink','coffee')
  return `Surely, i will make ${drink} for you`

})
```

Here you made the `drink` parameter optional by adding a `?` , also `request.param` accepts another argument which will we used a default value when actual key/value pair is missing on the params object.

### Closures

Closures are callbacks attached to the route that gets invoked every time a route is called. Closures are nice for quick response but for real applications you may prefer using `Controllers`


### Controller Methods

Controller methods are methods on your controllers, which can be referenced as string values while defining your routes.

```javascript,line-numbers
Route.get('/home','HomeController.index')
```

And then inside HomeController you can define the index method, which looks exactly the same as your closures.

```javascript,line-numbers
// app/Http/Controllers/HomeController.js

class HomeController{

  *index(request,response) {
    response.send('Hello from the controller method')
  }

}

module.exports = HomeController
```


## Route Middleware

Middleware are methods executed before reaching to route method, they are great for filtering incoming requests. You can read more about them on [middleware page](middleware)


#### for single route

```javascript,line-numbers
Route.get('/user','UserController.index').middlewares(['auth','admin'])
```

#### group of routes

```javascript,line-numbers
Route.group('authenticated',function(){

  Route.get('user','UserController.index')

}).middlewares('auth','admin').close()
```


## Named Routes

Named routes are routes with `name`, think of them as you have binded a route under a unique name and later you can reference that route with name instead of it's pattern.

```javascript,line-numbers
Route.get('user/:id','UserController.show').as('profile');
```

Later you can generate URL using the given name.

```javascript,line-numbers
Route.url('profile',{id:1});
// returns /user/1
```

## Route Groups

A group is a collection of routes following same configuration without typing it for every single route.


### Prefixing routes

```javascript,line-numbers
Route.group('version1',function () {

  Route.get('/users','HomeController.index');
  Route.post('/users','HomeController.store');

}).prefix('/api/v1').close()
```

Now of all your routes under the above group will have `/api/v1` prefix and you do not have to enter same on each route.

### Attaching middleware

```javascript,line-numbers
Route.group('authenticated',function () {

  // Define your routes here

}).middlwares('auth').close();
```

### Domain specific routes

Also using groups you can create domain specific routes.

```javascript,line-numbers
Route.group('accounts', function () {

  Route.get('/profile','UsersController.index');

}).domain(':user.subdomain.com').close();
```

Above group will enable you to listen for dynamic subdomains. For Example

1. user1.subdomain.com/profile
2. user2.subdomain.com/profile

<div class='__note'>
    <p>Always make sure to close your groups using `.close()` method.</p>
</div>


## Making Url

Once you have defined routes, you can generate full URLs to them.


### using full route definition

```javascript,line-numbers
Route.get('/user/:id', function * () {

    // handle here

})

const profile = Route.url('/user/:id', {id:1})
// will output /user/1

```


### using named routes

Named routes make it even easier to generate url for a given route.

```javascript,line-numbers
Route.get('/user/:id', 'ProfileController.show').as('profile')

const profile = Route.url('profile', {id:1})
// will output /user/1

```



## Throwing Exceptions

You can always use the `response` object to build your responses for a given request. Where `HttpException` class can get handy in situations where you do not have access to the response object.

```javascript,line-numbers
const HttpException = use('Adonis/Src/HttpException')

Route.get('/profile',function * () {
    throw new HttpException(401,'You must be logged in')
})

```
