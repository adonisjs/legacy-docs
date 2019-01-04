# Config

Config provider makes it easier for you to define and manipulate application configuration. `config` directory under root of your project is dedicated
to configuration and each file must export configuration using `module.exports`.



- [Using Defined Configuration](#using-defined-configuration)
- [Defining Configuration](#defining-configuration)



## Using Defined Configuration

Using configuration defined under `config` is pretty simple to use it makes use of `dot notation` while getting/setting values for a given key.
Before you start using Config provider, make sure to get it from the IOC container.

```javascript,line-numbers
const Config = use('Config')
```

```javascript,line-numbers
// config/database.js

module.exports = {
  MySQL:{
    host: 127.0.0.1,
    ...
  }
}
```


#### get <span>(key=string)</span>

Now you can access value for any given key

```javascript,line-numbers
// grabbing host
Config.get('database.mysql.host')

// or may be complete mysql config
Config.get('database.mysql')
```


#### set <span>(key=string,value=*)</span>

You can also update values for any given key.

```javascript,line-numbers
Config.set('database.mysql.password','foobar')
```


## Defining Configuration

Defining configuration is straight forward, start by creating a new file inside config directory, make sure the filename ends with `.js`.

```javascript,line-numbers
// config/settings.js

module.exports = {

  timezone: 'GMT',
  offset: '5',
  ...

}

```

And again you can make use of `get` method on `Config` provider to read values from this file.

```javascript,line-numbers
const Config = use('Config')

Config.get('settings.timezone')
```
