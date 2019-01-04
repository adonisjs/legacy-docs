# Upgrade

This guide outlines the requirements and breaking changes to upgrade Adonis to latest version. As Adonis follows [semver](http://semver.org/), upgrade guides is only valid for major releases, breaking changes for something new, for other minor/patch releases look into [release notes](release-notes).

- [Release of Adonis middleware](#release-of-adonis-middleware)
- [Upgrading to 2.0](#upgrading-to-2.0)

## Release of Adonis middleware
New package [adonis-middleware](https://github.com/adonisjs/adonis-middleware) has bunch of new middleware to keep your applications secure and stable. With it's release, you are supposed to delete your local middleware under `app/Http/Middleware`. This guide is also valid if your were/are using `adonis-framework 2.0.5` or lower.

Watch this [video](https://www.youtube.com/watch?v=Pu4Y-CWH4yE) to keep yourself updated.


## Upgrading to 2.0

The majority of `Adonis 2.0.0` code has been re-written from scratch to improve stability and performance. Since IO.js has been merged into NodeJs, we do not support IO.js officially.

## Breaking Changes

Breaking changes with 2.0 is expected as majority of code is re-written from scratch for performance gains. Read the below points carefully as it will help you in smooth transition from 1.0 to 2.0.

#### Removed deferred providers

Deferred providers have been removed for the sake of simplicity, and you are expected to remove unwanted providers from `bootstrap/app.js` file as they will impact the application boot time.

#### Typehinting removed from providers

Earlier you have to type hint dependencies inside your custom providers, which was bit ugly and less readable, now the IOC container instance is injected to the callback method, giving you the flexibility to fetch dependencies instead of type hinting.

##### earlier

```javascript,line-numbers
class FileProvider extends ServiceProvider {

  * register () {
    this.app.bind('Addons/FileProvider', function (App_Src_Config,App_Src_Helpers) {
      return new File(App_Src_Config,App_Src_Helpers)
    })
  }

}
```

##### now

```javascript,line-numbers
class FileProvider extends ServiceProvider{

  * register () {
    this.app.bind('Addons/FileProvider', function (app) {
      const Config = app.use('App/Src/Config')
      const Helpers = app.use('App/Src/Helpers')
      return new File(Config,Helpers)
    })
  }

}
```

#### Route.group `close` method has been removed.

Earlier you were supposed to close route groups when creating a group but now groups are smart enough to close themselves.

##### earlier
```javascript,line-numbers
Route.group('v1', function () {
  ...
}).prefix('/v1').close()
```

##### now
```javascript,line-numbers
Route.group('v1', function () {
  ...
}).prefix('/v1')
```

#### Improved middleware flow

Earlier global middleware used to run on urls with valid registered routes, since this is not the ideal behavior, now they will be executed even if there are no registered routes.

#### pm2 is removed.

pm2 is a daemon that runs node processes in a background and watch files for changes, the moment a file changes it will restart the server again. Also, it manage crashes in production by restarting the server again after the crash.

We have removed pm2 for several reasons

1. First it's better to install pm2 globally and manage multiple servers, instead of using a separate pm2 for each application.
2. Next we have plans to add services like `Vagrant` for seamless provisioning and will likely going to have a better solution than just dropping pm2 in your code base.

#### ace commands

Earlier ace commands used to define the command identifier inside the signature, which means all commands needs to be loaded while running a single command. Now signature only defines the expectations of command and command identifier inside set inside `bootstrap/app.js` file.

##### earlier
```javascript,line-numbers
class Generator {

  signature () {
    return 'make:controller {name} {--plain}'
  }

}

// and inside bootstrap/app.js
const commands = [
  'Adonis/Commands/Generator'
]
```

###### now
```javascript,line-numbers
class Generator {

  signature () {
    return '{name} {--plain}'
  }

}

// and inside bootstrap/app.js
const commands = {
  'make:controller' : 'Adonis/Commands/Generator'
}
```
