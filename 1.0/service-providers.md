# Service providers

Service providers are the real power behind Adonis, they make it easier for anyone to write small isolated modules and make them talk to each other via service providers.

The core of Adonis is built on top of service providers, where they are dependent upon each other, without requiring each other as core dependencies.



- [Simple service providers](#simple-service-providers)
- [Writing One](#writing-one)
- [Deferred service providers](#deferred-servicep-roviders)


## Simple service providers

For a basic service provider, it will look like this

```javascript,line-numbers

class Dance{

  samba(){
    // dance here
  }

  street(){
    // dance here
  }

}

class DanceServiceProvider extends ServiceProvider{

  *register(){

    this.app.bind('App/Dance',function(){
      return new Dance()
    })

  }

}
```

Above we created a simple yet useful service provider, which needs to have a `register` method that gets called while registering a provider.


### singletons

```javascript,line-numbers

*register(){

  this.app.singleton('App/Dance',function(){
    return new Dance()
  })

}
```

Singleton will return the same instance each time.


### Injecting other service providers.

All the magic happens while writing providers, as you can leverage the power of dependency injection out of the box.
Think of a situation where you want to use the `Config` provider and do something based upon loaded configuration.

```javascript,line-numbers

class Database{

  constructor(Config){
    this.config = Config
  }

}


class DatabaseServiceProvider extends ServiceProvider{


  static get inject(){
    return ['Adonis/Src/Config']
  }

  *register(){

    this.app.singleton('Adonis/Src/Database',function(Config){
      return new Database(Config)
    })

  }

}

```


## Writing One

For your application, you can write service providers inside `providers/` directory. Make sure to register them inside `boostrap/app.js` file.


#### providers/DateTime/DateTime.js

```javascript,line-numbers
class DateTime {

  getTime(){
    return new Date().getTime
  }

}
```

Above we created a class that we will bind to IOC container using a service provider.


#### providers/DateTime/provider.js

```javascript,line-numbers
const ServiceProvider = require('fold').ServiceProvider
const DateTime = require('./DateTime')

class DateTimeProvider extends ServiceProvider{

  *register(){

    this.app.bind('MyApp/DateTime',function(){
      return new DateTime()
    })

  }

}
```

Finally, you have to register DateTime service provider to IOC Container, which is done inside `boostrap/app.js` file.


#### bootstrap/app.js

```javascript,line-numbers
providers: [
  path.join(__dirname,'../providers/DateTime/provider.js')
]
```

Successfully you have created and registered a simple service provider, which can be consumed anywhere inside your application using a namespace.

```javascript,line-numbers
const DateTime = use('MyApp/Datetime')
console.log(DateTime.getTime())
```

## Deferred service providers

Deferred service providers are not loaded while booting your app, in fact Adonis does not even load them from the disk.
To use deferred service providers, you have to make them, which is an async process.


### making deferred service providers.

Anywhere in your application you can make deferred providers using `make` function, or you can inject them as a dependency on your class constructors.

```javascript,line-numbers
class UsersController{

  *show(){
    const dateTime = yield make('MyApp/DateTime')
  }

}
```

Or you can inject them as a dependency.

```javascript,line-numbers
class UsersController{

  constructor(MyApp_DateTime){
    this.datetime = MyApp_DateTime
  }

}
```
