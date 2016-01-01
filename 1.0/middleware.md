# Middleware

Http Middleware work as the gate keeper to your application routes, think about them filtering requests from reaching your route methods.



- [Defining Middleware](#defining-middleware)
- [Registering Middleware](#registering-middleware)
    - [Global middleware](#global-middleware)
    - [Named middleware](#named-middleware)




## Defining Middleware

With Adonis, individual ES6 class is dedicated for single every middleware and must be defined in `app/Http/Middleware` folder. Alternatively you can use `ace command` to generate a middleware.


```bash,line-numbers
node ace make:middleware Authentication
```

#### basic middleware
```javascript,line-numbers
// app/Http/Middleware/Authentication.js

class Authentication{

  *handle(request,response,next) {

    if (!User.auth()) {
        response.unathorized('You must be logged in')
        return
    }
    yield next

  }

}
```

On above middleware, `handle` method is an Es6 generator function, which accepts three arguments. If you want the request to go forward than `yield next` otherwise throw an error or make use of a `response` object to build an HTTP response.


## Registering Middleware

So far you have defined middleware , and is not registered inside application to be used.

### Global middleware

Global middleware are called on every request and must be registered inside `app/Http/kernel.js` file under `globalMiddlewares` array. Array order will define the execution order for each middleware.

### Named middleware

Named middleware is more specific to routes, you can make a decision on which route a middleware will get called.

You can define key values pairs under `namedMiddlewares` inside `app/Http/kernel.js` file , keys can be referenced on your routes to attach middleware.

#### Inside kernel.js file

```javascript,line-numbers
const namedMiddleware = {
  'auth': 'App/Http/Middleware/Authentication'
}
```

#### Usage inside routes.js file

```javascript,line-numbers
Route
.get('/profile/:id','UsersController.show')
.middlewares(['auth'])
```
