# Service Providers

Service providers are like your real life service providers that offer you different services. Npm modules are also kind of service providers but they are not aware of how your application is structured.

With Adonis, each service provider can inject other service providers and this is where all the magic happens. Adonis itself is a combination of several service providers which can be found inside `bootstrap/app.js` file.

- [Philosophy](#philosophy)
- [Creating Service Providers](#creating-service-providers)

## Philosophy

As Service provider is a new term in Nodejs, let's try to understand it. Taking an example of an npm module, which you can install and require inside your application. Now let's say this module wants to read the config file inside your project, it will not be able to read it transparently and hence will ask you to pass the config as some argument.

#### hello world module

```javascript,line-numbers
module.exports = {
  greet: function (locale) {
    switch (locale) {
      case 'fr':
        return 'Bonjour le monde'
      case 'es':
        return 'Hola Mundo'
      default:
        return 'Hello world'
    }
  }
}
```

Now you can require this module and call the greet function by passing the locale.

```javascript,line-numbers
const config = require('./config')
const helloWorld = require('./hello-world')
helloWorld.greet(config.locale)
```

It works but the method call itself is not very transparent and you are required to manually pass the `locale` by reading it from config.
Now service providers improves upon this pattern and let you write modules where they can satisfy their requirements of their own.

## Creating Service Providers

Let's re-write the above code in Adonis leveraging the power of Ioc container and make it a service provider.
We will start by creating a new directory called `Hello` inside `providers` directory, which will have couple of files to achieve the desired result.

##### providers/Hello/Hello.js
```javascript,line-numbers
class Hello {

  constructor (Config) {
    this.locale = Config.get('app.locale')
  }

  greet () {
    switch (this.locale) {
      case 'fr':
        return 'Bonjour le monde'
      case 'es':
        return 'Hola Mundo'
      default:
        return 'Hello world'
    }
  }
}

module.exports = Hello
```

Next we need to bind the above class inside the Ioc container and for that we will create the service provider.

##### providers/Hello/HelloProvider.js

```javascript,line-numbers
const ServiceProvider = require('adonis-fold').ServiceProvider

class HelloProvider extends ServiceProvider {

  * register () {
    this.app.bind('App/Hello', function (app) {
      const Hello = require('./Hello')
      const Config = app.use('Config')
      return new Hello(Config)
    })
  }
}

module.exports = HelloProvider
```

Finally you will to register `HelloProvider` inside `bootstrap/app.js` under `providers` array.

```javascript,line-numbers
const providers = [
  path.join(__dirname,'../providers/Hello/HelloProvider.js')
]
```

#### Flashback

What happened here ? If you will look at the class inside `providers/Hello/Hello.js` file, it is fairly simple and it asks for `Config` provider to be injected inside constructor to read the locale.

Now `HelloProvider.js` file is little special as it needs to have a `register` method, which is picked by Ioc container while registering this provider. Next we call the function `this.app.bind` and give two arguments.

1. Provider Namespace is the label you give to a box to recognize it later and needs to be unique.
2. Callback function is the method invoked everytime your provider is resolved/used and this is place where you define what to return and also here you can grab other service providers.
