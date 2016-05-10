---
title: Config
permalink: config
weight: 1
categories:
- providers
---

Adonis application configuration is managed via config files. Each config file is defined inside the `config` directory in the root of every application.

Make sure to export an object from your config files. For example-

##### config/app.js
```javascript
module.exports = {
	appKey: '...'
}
```

## Read/Update Config

Config provider makes use of dot notation to read and update existing values.


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

Updates value of an existing key. It will define the value if the key does not exists already.

```javascript
'use strict'

const Config = use('Config')
Config.set('auth.authenticator', 'basic')
```