---
title: Config
permalink: config
weight: 1
categories:
- getting-started
---

AdonisJs application configuration is managed via config files. Each config file is defined inside the `config` directory in the root of every application.

Make sure to export an object from your config files. For example:

##### config/app.js
```javascript
module.exports = {
  appKey: '...'
}
```

## Read/Update Config

You can easily read config values using the `Config` provider anywhere inside your application.

Also Config provider makes use of **dot notation**, which means you can reference nested keys using the dot separator.

```javascript
const Config = use('Config')

Config.get('database.connection')
// returns value of connection from database.js file.
```


#### get(key, [defaultValue])

Returns the value for a key inside the config file. It will return defaultValue when value for defined key does not exists.

```javascript
'use strict'

const Config = use('Config')

Config.get('database.connection')
// or
Config.get('database.connection', 'mysql')
```


#### set(key, value)

Updates value of an existing key. It will instead define the value, if the key does not exists.

```javascript
'use strict'

const Config = use('Config')
Config.set('auth.authenticator', 'basic')
```
