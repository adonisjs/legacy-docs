# Connection

Database provider is a fluent query builder, making it easier to write SQL queries with Javascript syntax. You will find query builder syntax so easy to understand and construct queries even if you do not understand `SQL` properly.

- [Databases Supported](#database-supported)
- [Config](#config)
- [Basic Usage](#basic-usage)

## Databases Supported

1. Mysql
2. PostgreSQL
3. Sqlite
4. MariaDB

## Config

You start by defining connection settings inside `config/database.js` file, which is used by `Database` provider internally. As you are free to define multiple connection settings inside config file, you also need to define default connection to be used.

```javascript,line-numbers
// config/database.js

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the settings to be used while setting up a database
  | it is a reference of defined connections below in this file.
  |
  */
  connection: Env.get('DB_CONNECTION', 'sqlite'),

  /*
  |--------------------------------------------------------------------------
  |   Sqlite Connection
  |--------------------------------------------------------------------------
  |
  |   Here we define sqlite connection to be used by your models or
  |   Database provider. It is good keep development database as
  |   sqlite , rest depends upon your application preferences.
  |
  |--------------------------------------------------------------------------
  |   npm install --save-dev sqlite3
  |--------------------------------------------------------------------------
  |
  */
  sqlite: {
    client: 'sqlite3',
    connection: {
      filename: Helpers.storagePath('development.sqlite3')
    },
    debug: false
  }
}
```

## Basic Usage

Once you have your connection settings in place, you are ready to get started to make use of `Database` provider.

```javascript,line-numbers
const Database = use('Database')

// selecting users
const users = yield Database.table('users').select('*')
```

Above we made use of Database provider to make queries without cluttering your code with callbacks.

#### Switching Connections

By default `Database` provider will create a connection pool to reuse the same connection, but in case if you want to use different connection for a given query, you can make use of `connection` method.

```javascript,line-numbers
const users = yield Database.connection('mysql').table('users').select('*')
```

Also, you need to define connection settings inside `config/database.js` file which is used by connection method.
