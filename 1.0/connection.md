# Connection

Database provider is a solid ORM enabling you to interact with SQL databases using fluent query builder.



- [Databases Supported](#database-supported)
- [Config](#config)
- [Basic Usage](#basic-usage)


## Databases Supported

* Mysql
* PostgreSQL
* Sqlite
* MariaDB


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

#### Setting up defined connection as default

```bash,line-numbers
# .env
DB_CONNECTION=sqlite
```


## Basic Usage

Once you have your connection settings in place, you are ready to get started to make use of `Database` provider.

```javascript,line-numbers
const Database = use('Database')

// selecting users
const users = yield Database.table('users').select('*')

```

Above we made use of Database provider to make queries out of the box without cluttering your code with callbacks.


### Switching Connections

By default `Database` provider will create a connection pool to reuse the same connection, but in cases where you want to use different connection in order
to make queries you can do that by use `connection` method.

```javascript,line-numbers
const users = yield Database.connection('mysql').table('users').select('*')
```

Also, you need to define connection settings inside `config/database.js` file which used by connection method.
