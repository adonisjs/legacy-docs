# Upgrade

This guide outlines the requirements and breakings changes to upgrade Adonis to lastest version. As Adonis follows [semver](http://semver.org/), upgrade guides is only valid for major releases, for other minor/patch releases look into release notes.

- [Upgrading to 2.0](upgrading-to-2.0)

## Upgrading to 2.0

The majority of `Adonis 2.0.0` code has been re-written from scratch to improve stability and performance. Since IO.js has been merged into NodeJs, we do not support IO.js officially.

## Breaking Changes

Breaking changes with 2.0 is expected as majority of code is re-written from scratch for performance gains. Read the below points carefully as it will help you in smooth transition from 1.0 to 2.0.

#### Removed deferred providers

Deferred providers have been removed for the sake of simplicity, and you are expected to remove unwanted providers from `bootstrap/app.js` file as they will impact the application boot time.

#### Typehinting removed from providers

Earlier you have to type hint dependencies inside your custom providers, which was bit ugly and less readable, now the IOC container instance is injected to the callback method, giving you the flexibility to fetch dependencies instead of type hinting.

**earlier**

```javascript,line-numbers
class FileProvider extends ServiceProvider {

  * register () {
    this.app.bind('Addons/FileProvider', function (App_Src_Config,App_Src_Helpers) {
      return new File(App_Src_Config,App_Src_Helpers)
    })
  }

}
```

**now**

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

**earlier**
```javascript,line-numbers
Route.group('v1', function () {
  ...
}).prefix('/v1').close()
```

**npw**
```javascript,line-numbers
Route.group('v1', function () {
  ...
}).prefix('/v1')
```

#### Improved middleware flow

Earlier global middleware used to run when a request reaches a valid registered route since this is not the ideal behavior, now they will be executed even if there are no registered routes.

#### pm2 is removed.

pm2 is a daemon that runs node processes in a background and watch files for changes, the moment a file changes it will restart the server again. Also, it manage crashes in production by restarting the server again after the crash.

We have removed pm2 for several reasons:

* First it's better to install pm2 globally and manage multiple servers, instead of using a separate pm2 for each application.
* Next we have plans to add services like `Vagrant` for seamless provisioning and will likely going to have a better solution than just dropping pm2 in your code base.

## Features Introduced

#### Bunch of new service providers.

New service providers have been introduced to give you extra arms while writing your Node applications. Which includes:

* Redis
* Encryption
* Hashing
* Mail
* Socket.Io

#### Power to extend providers

It is very important for service providers to be extended and offer more functionality, from `2.0.0` service providers can expose an API to outside world for same. For example

Session provider offers an API to add more drivers.

```javascript,line-number
Ioc.extend('Adonis/Src/Session', 'mongo', function (app) {
  return new MongoSessionStore()
})
```

#### Seamless migrations

Under the hood, we still make use of `knex` to run database operations, but as Adonis is all about writing expressive code, we have added our own migrations provider.

Now you can write migrations as follows

```javascript,line-numbers

const Schema = use('Schema')

class CreateUsersTable extends Schema {

  up () {
    this.create('users', function (table) {
      table.increments()
      table.string('username')
      table.timestamps()
    })
  }

}

```
