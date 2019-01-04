
# Controllers

Instead of binding `Closures` to your routes , you may prefer using controllers which are dedicated ES6 classes and have plenty other benefits over route callbacks.

- [Defining Controllers](#defining-controllers)
- [Resourceful Controllers](#resourceful-controllers)
- [Dependency Injection](#dependency-injection)
    - [via inject method](#via-inject-method)
    - [type hinting dependencies](#type-hinting-dependencies)


## Defining Controllers

Controllers are ES6 classes , stored under `app/Http/Controllers` directory. To keep your routes readable, you reference controller methods as a string, which have to follow some conventions.

1. Controller file name will be used, not `class` name.
2. You should use incremental or full namespace while binding controllers to your routes.

```javascript,line-numbers
/**
* @filepath app/Http/Controllers/UserController
*/

class UserController{

  *index(request,response) {

    let users = yield Users.all()
    return users.toJSON()

  }

}
```

#### Inside Routes.js file

```javascript,line-numbers
Route.get('/users','UserController.index')
```

#### Or

```javascript,line-numbers
Route.get('/users','App/Http/Controllers/UserController.index')
```

Later we have used the full namespace, do read **application architecture** to understand how namespaces are defined and used in Adonis.

Alternatively you can use the ace command to generate controller.

```bash,line-numbers
ace make:controller User
```

## Resourceful Controllers

Think about them as doing crud operations with single route definition. You can only bind controllers to resourceful routes.


#### Route.js

```javascript,line-numbers
Routes.resource('/users','UsersController')
```

Above will bind following routes to your application.

| route        | verb           | controller method  |
| ------------- |-------------| -----|
| /users | GET | UsersController.index |
| /users | POST | UsersController.store |
| /users/:id | GET | UsersController.show |
| /users/:id | PUT | UsersController.update |
| /users/:id | DELETE | UsersController.destroy |


## Dependency Injection

Apart from resourceful routes and ES6 classes, Dependency Injection makes your controllers special and convenient over `Closures`.
Adonis is built on top of solid DI layer, making it easier to integrate 3rd party modules/providers and writing tests by mocking dependencies.

To inject dependencies, you have to make your controllers instance as defined below.

1. The controller may have a static method defining dependencies as an array.
2. Also, Controller can type hint dependencies right into the constructor method.


### via inject method

```javascript,line-numbers
class UsersController{

    static get inject(){
        return ['Adonis/Addons/Redis']
    }

    constructor(Redis){
        this.redis = Redis
    }

    *store(){

        this.redis.set('username',username)

    }

}
```

`inject` method defines dependencies as an array and injects them into controller constructor in the same order as the array.
To inject dependencies, you have to use their namespace.

You can find all service providers inside `bootstrap/app.js` file.
Some service providers use unique `aliases` for their namespace making them easier to read and use.


### type hinting dependencies

Using type hint you can remove `static inject` method completely from your controller and can use descriptive names inside your constructor method.

<div class='__note'>
  <p>
    <strong>Note :</strong> Type hinting has no advantage over inject method, it is all about personal preference.    
  </p>
</div>

```javascript,line-numbers
class UsersController{

    constructor(Adonis_Addons_Redis){
        this.redis = Adonis_Addons_Redis
    }

    *store(){

        this.redis.set('username',username)

    }

}
```

Above we removed `/` with `_`, as slash is not a valid character for Javascript variables. Using this approach can make your constructors dusty, as you have to type hint complete namespaces.

But yes for aliased providers, it can be handy and sensible to use constructor type hint.

<div class='__note'>
  <p> <strong>Note : </strong> You cannot use type hinting and static inject method together.</p>
</div>
