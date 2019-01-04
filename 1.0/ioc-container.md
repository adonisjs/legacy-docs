# IOC Container

Inversion of control is a way to manage dependencies across your application in a unified manner. NodeJs `require` module does a good job in managing dependencies, but for scalable applications we need more.

Adonis ships with handcrafted IOC container to manage and resolve dependencies out of the box.
IOC container is a combination of



- [Dependency Injection](#dependency-injection)
- [Namespace](#namespace)
- [Service providers](#service-providers)
- [Autoloading](#autoloading)


## Dependency Injection

Think of dependency injection as parameters to your functions, as ES6 is progressing, and we have access to ES6 classes, injecting dependencies takes place inside your `class constructors`

```javascript,line-numbers

class Users{

  constructor(Redis){
    this.redis = Redis
  }

}

```

Above we do not require `Redis` using `require` module, instead we inject it to our constructor, which we can easily mock it while writing tests.
Now you would be thinking how `Redis` will be injected to the constructor without requiring it. Now the real magic happens in a sequence.


### part 1

To inject `Redis` we need to bind it to the IOC container.

```javascript,line-numbers
Ioc.bind('Redis',function(){
    return require('redis')
})
```

Now `Redis` is a part of IOC container, which means we can make use of it anytime using the `use` method.
But we do not want to require it like a normal module, we want to inject it in our class constructor so that we can mock it whenever we want.


## part 2 ( making class )

```javascript,line-numbers
class Users{

  constructor(Redis){
    this.redis = Redis
  }

}
let users = yield make(Users)
```

Here we use `make` method, which is a global method provided by IOC container to make a class instance, which itself looks for constructor dependencies and inject them to your class instance.


## Namespace

A namespace is a set of symbols that are used to organize objects of various kinds so that these objects may be referred to by name [Wikipedia](https://en.wikipedia.org/wiki/Namespace).
In general when you want to require something, you have to follow directories in and out accessors to reach to a particular path.

#### with node require module

```javascript,line-numbers
require('../../Services/Foo')
```

#### with namespace

```javascript,line-numbers
use('App/Services/Foo')
```

Later is more readable and always remains same regardless of the directory you are referring it from.
With Adonis everything is a namespace starting from service providers, application Controllers, Models, etc.

Namespace follows some convention to make a logical space in users mind, but it is not important to have a conventional namespace.


## Service providers

Adonis application layer service providers follow below namespace.

```bash,line-numbers
Adonis/Src
```

so all core components prepend the above namespace and can be seen inside `bootstrap/providers.js` file.

#### example

 * Adonis/Src/Routes
 * Adonis/Src/View
 * Adonis/Src/Static
 * Adonis/Src/App

Additional components shipped with Adonis follow a different namespace called.

```bash,line-numbers
Adonis/Addons
```

providers like `Validation` , `Redis` , `Encryption` prepend the above namespace.
You can also write your providers inside `providers` directory and make sure to require them inside `bootstrap/app.js` file.


## Autoloading

All directories and files inside the `./app` the directory is set for autoloading under `App` namespace, which can be changed inside your package.json file.

> Adonis do not autoload all files in advance as it will impact performance, instead they are resolved on runtime. But we do need to know which directory is set for autoloading

```javascript,line-numbers
{
    name: 'your-app-name',
    autoload: {
        'App': './app'
    }
}
```

With autoloading it becomes easier for you to use your application modules in a unified way.

```javascript,line-numbers
const UserModel = use('App/Model/User')
const UserService = use('App/Services/UserService')
```