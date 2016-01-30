# Controllers

Controllers in MVC is a layer between your views and models that respond to incoming requests registered using routes. They have plenty of benefits over route `Closures`.

- [Defining Controllers](#defining-controllers)
- [Resourceful Controllers](#resourceful-controllers)
  - [except](#except)
  - [only](#only)
  - [nested resources](#nested-resources)
- [Dependency Injection](#dependency-injection)
  - [type hinting dependencies](#type-hinting-dependencies)
  - [via inject method](#via-inject-method)

You start by creating controllers inside `app/Http/Controllers` directory and reference controllers with their filename within your routes. Alternatively you can make use of `ace command` to generate a new controller.

``` bash,line-numbers
./ace make:controller Home
// or
./ace make:controller Home --plain
```



## Defining Controllers

Controllers are defined as ES6 classes and can have multiple generator functions.

``` javascript,line-numbers
class UserController {

  *index (request, response) {
    let users = yield Users.all()
    response.json(users.toJSON())
  }

}

module.exports = HomeController
```

#### Inside routes.js file

``` javascript,line-numbers
Route.get('/users', 'UserController.index')
```

## Resourceful Controllers

Resourceful routes define multiple routes and attach conventional methods to them under single route definition.

``` javascript,line-numbers
Route.resource('users', 'UserController')
```

Following routes will be bound to UserController

| route           | verb      | action                 |
| --------------- | --------- | ---------------------- |
| /users          | GET       | UserController.index   |
| /users/create   | GET       | UserController.create  |
| /users          | POST      | UserController.store   |
| /users/:id      | GET       | UserController.show    |
| /users/:id/edit | GET       | UserController.edit    |
| /users/:id      | PUT/PATCH | UserController.update  |
| /users/:id      | DELETE    | UserController.destroy |



#### except <span>([actions])</span>

`except` helps you in filtering the routes a resource will setup for you. All other actions will be configured apart from the actions defined as an array.

``` javascript,line-numbers
Route.resource('users', 'UserController').except(['create', 'edit', 'destroy'])
```



#### only <span>([actions])</span>

`only` is the opposite of except and will only set the defined action by filtering out all others. Make sure to use one at a time not both.

``` javascript,line-numbers
Route.resource('users', 'UserController').only(['store', 'update', 'index'])
```



#### nested resources

You can also set nested resources using `resource` method.

``` 
Route.resource('user.posts', 'PostsController')
```

and above will setup following routes for you.



| route                         | verb      | action                  |
| ----------------------------- | --------- | ----------------------- |
| /user/:user_id/posts          | GET       | PostsController.index   |
| /user/:user_id/posts/create   | GET       | PostsController.create  |
| /user/:user_id/posts          | POST      | PostsController.store   |
| /user/:user_id/posts/:id      | GET       | PostsController.show    |
| /user/:user_id/posts/:id/edit | GET       | PostsController.edit    |
| /user/:user_id/posts/:id      | PUT/PATCH | PostsController.update  |
| /user/:user_id/posts/:id      | DELETE    | PostsController.destroy |



## Dependency Injection

One of the biggest benefits of using controllers over closures is they support solid dependency injection out of the box. Dependencies are injected using the namespace as everything is registered and resolved out of IoC container.

#### using inject method

``` javascript,line-numbers
class UserController {

  static get inject () {
    return ["App/Model/User"]
  }

  constructor (User) {
    this.user = User
  }

}
```

`inject` method returns an array of Dependencies to be injected inside your controller, and behind the scenes Adonis will make an instance of `UserController` using `Ioc.make` method, which will inject all required dependencies.

The benefit of this approach is it makes your controllers testable as you can mock dependencies while testing them.

#### type hinting dependencies

Type hinting is an alternate to `static inject` method as IoC container will try to make your dependencies by reading your constructor arguments. While using constructor type hinting you have to replace `/` with `_` for your namespace.

``` javascript,line-numbers
class UserController {

  constructor (App_Model_User) {
    this.user = App_Model_User
  }

}
```

<div class="__note">

  <strong> Note: </strong> Typehinting has no advantage over `static inject` method, it is all about personal preference.

</div>