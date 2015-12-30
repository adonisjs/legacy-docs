# Config

Config provider helps you in getting and setting values from config store. `config` directory under the root of your project is dedicated to configuration and each file must export configuration using `module.exports`.

Config provider makes use of `dot-notation` while getting/setting values for a given key. Before you start using Config provider, make sure to get it from the IOC container.

```javascript,line-numbers
const Config = use('Config')
```

#### get <span>(key [, defaultValue])</span>

```javascript,line-numbers
Config.get('database.mysql.host')
// or set default value if incase host does not exists
Config.get('database.mysql.host', 'localhost')
```

#### set <span>(key, value)</span>

```javascript,line-numbers
Config.set('database.mysql.host', '127.0.0.1')
```
