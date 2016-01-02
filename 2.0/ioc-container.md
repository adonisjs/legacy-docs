# IoC Container

To understand Ioc Container you should know what [Dependency Injection](dependency-injection) is and why it is required. An IoC container is a layer to register and resolve dependencies out of a container and has several benefits when building modern applications.

- [Binding](#binding)
  - [bind](#bind)
  - [singleton](#singleton)
  - [alias](#alias)
- [Managers](#managers)
  - [extend](#extend)
- [Autoloading](#autoloading)
- [Resolving Dependencies](#resolving-dependencies)
  - [use](#use)
  - [make](#make)

## Binding

Binding objects to the IoC container requires a namespace and a return value to be used when resolving the dependency.

#### bind

```javascript,line-numbers
const Ioc = require('adonis-fold').Ioc

Ioc.bind('App/Hello', function () {
  return 'Hello World!'
})
```

Above we created a binding with a unique namespace called `App/Hello` which returns the string `Hello World`. This binding can now be used by resolving it from the IoC container.

```javascript,line-numbers
const Hello = use('App/Hello')
```

#### singleton

```javascript,line-numbers
const Ioc = require('adonis-fold').Ioc

Ioc.singleton('App/Time', function () {
  return new Date().getTime()
})
```

Above we bind a singleton, which means the return value will be same every time we resolve this binding out of the IoC container. The Ioc container has plenty of other benefits apart from registering and resolving objects.

#### dependency injection

```javascript,line-numbers
Ioc.bind('App/User', function (app) {
  const Redis = app.use('App/Redis')
  const Validator = app.use('App/Validator')
  return new User(Redis, Validator)
})
```

It is fairly simple to inject other bindings inside your binding. Also, it does not matter whether `Redis` was registered before or after your binding, IoC container will resolve it for you as long as it has been registered.

## Managers

Managers are like your bindings but they have different purpose, `object` exposed via manager needs to have an `extend` method and is used for extending implementations. The Mail provider is an example of this.

#### registering Mail as a manager inside the Ioc container

```javascript,line-numbers
Ioc.manager('Adonis/Addons/Mail', Mail)
```

#### extend

```javascript,line-numbers
Ioc.extend('Adonis/Addons/Mail', 'sendgrid', function () {
  return new SendGrid()
})
```

Using the `extend` method you can extend the `Mail` provider shipped with Adonis and add your own custom implementation. It is then the `Mail` provider's responsibility to understand and add `sendgrid` as a driver.

#### alias

Alias is key/value pair to identify a namespace with its alias. For example

1. `Adonis/Addons/Mail` has an alias of `Mail`
2. `Adonis/Src/Route` has an alias of `Route`

```javascript,line-numbers
Ioc.alias('Route','Adonis/Src/Route')
```

Alias works for both managers and bindings.

## Autoloading

Autoloading is handled cleverly by the IoC container, it does not require all the files in memory. Instead, while resolving dependencies, it tries to make a sequence of `namespace`s and see if the required namespace is inside a given path.

```javascript,line-numbers
Ioc.autoload('App',path.join(__dirname,'./app'))
```

Now any file inside `./app` directory can be referenced as `App/<filePath>` as Adonis will lazy load it for you.

```javascript,line-numbers
use('App/Http/routes')
use('App/Http/Middleware/Cors')
```

## Resolving Dependencies

Resolving dependencies is a sequential process and the IoC container will try to find the requested namespace in given order.

1. looks for the registered provider.
2. looks for an alias and re-resolve provider with its namespace
2. looks for an autoloaded path.
3. tries requiring as a node module
4. throws an error, saying module not found.

#### use

Use will return binded value using its namespace

```javascript,line-numbers
const Route = Ioc.use('Adonis/Src/Route')
```

#### make

Make is smarter and will try to satisfy dependencies until the last injection and always returns an instance of the class if the value passed to make is a class. Below are the list of the rules followed by the `make` method based on data type of the argument.

##### Class
will introspect to find dependecies using `constructor` or `static inject` getter.

##### Provider
makes use of the `use` method and returns value returned by the provider, as providers are responsible for satisfying their own dependencies.

##### Any other data type
returns the original reference as the IoC container does know how to make anything else from `Classes`.

##### Autoload Namespace
Gets value using the `use` method and follows the below rules:
1. if the return value is a `Class`, try to follow the entire process again.
2. otherwise return the original return value.

```javascript,line-numbers
Class UserController {

  static get inject () {
    return ["Adonis/Addons/Mail","App/Model/User"]
  }

  constructor (Mail, User) {
    this.mail = Mail
    this.user = User
  }

}

const userController = make(UserController)
// or
const userController = make('App/Http/Controllers/UserController')
```
