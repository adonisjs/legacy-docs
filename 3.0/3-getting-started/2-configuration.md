---
title: Configuration
permalink: configuration
description: Configuration management in AdonisJs
categories:
- getting-started
---

{{TOC}}

Configuration files for AdonisJs application are stored inside the `config` directory. Config provider is used to read/update values from these files.

## Basic Example

Let's make use of Config provider to read values from `config/database.js` file.

##### config/database.js

```javascript
{
	mysql: {
		host: 'localhost'
	}
}
```

```javascript
const Config = use('Config')

Config.get('database.mysql.host')
// returns localhost
```

## Reading/Updating Values

#### get(key, [defaultValue])

Returns value for a given key or returns back the default value.

```javascript
const host = Config.get('database.mysql.host')
// or
const host = Config.get('database.mysql.host', 'localhost')
```

#### set(key, value)

Sets key/value pair to the config store.

```javascript
Config.set('database.mysql.host', '127.0.0.1')
```
