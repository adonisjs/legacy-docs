# Connection

Database provider is a fluent query builder, making it easier to write SQL queries with Javascript syntax. You will find query builder syntax so easy to understand and construct queries even if you do not understand `SQL` properly.

<p>&nbsp;</p>

- [Databases Supported](#database-supported)
- [Setup](#setup)
- [Config](#config)
- [Basic Usage](#basic-usage)

<p>&nbsp;</p>

## Databases Supported

* Mysql
* PostgreSQL
* Sqlite
* MariaDB

<p>&nbsp;</p>

## Setup
You need to include database provider inside your providers list and give it an alias to avoid using full namespace.

### installing via npm

```bash,line-numbers
npm install --save adonis-lucid
```

### adding to providers list

Open `bootstrap/app.js` file and add following to it. Database provider is also dependent upon `Collections` provider, so you will have to add that too.

```javascript,line-numbers
const providers = [
  'adonis-lucid/providers/CollectionProvider',
  'adonis-lucid/providers/DatabaseProvider',
  'adonis-lucid/providers/LucidProvider'
]
```

### adding alias

```javascript,line-numbers
const aliases = {
  'Collection' : 'Adonis/Src/Collection',
  'Database' : 'Adonis/Src/Database',
  'Lucid'    : 'Adonis/Src/Lucid'
}
```


## Config

You start by defining connection settings inside `config/database.js` file, which is used by `Database` provider internally. As you are free to define multiple connection settings inside config file, you need to define default connection to use inside `.env` file.

```javascript,line-numbers
// config/database.js

module.exports = {
  sqlite: {
    client: 'sqlite3'
    connection : {
      filename: `${Helpers.storagePath('database.sqlite')}`
    }
  }
}

```

### Setting up defined connection as default

```bash,line-numbers
# .env
DB_CONNECTION=sqlite
```

<p>&nbsp;</p>
## Basic Usage

Once you have your connection settings in place, you are ready to get started to make use of `Database` provider.

```javascript,line-numbers
const Database = use('Database')

// selecting users
const users = yield Database.table('users').select('*')
```

Above we made use of Database provider to make queries without cluttering your code with callbacks.

<p>&nbsp;</p>
### Switching Connections

By default `Database` provider will create a connection pool to reuse the same connection, but in case if you want to use different connection for a given query, you can make use of `connection` method.

```javascript,line-numbers
const users = yield Database.connection('mysql').table('users').select('*')
```

Also, you need to define connection settings inside `config/database.js` file which is used by connection method.
