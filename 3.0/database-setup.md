---
title: Database Setup
description: Setting up database with AdonisJs
permalink: database-setup
weight: 0
categories:
- Database
---

AdonisJs officially supports the list of databases listed below. All of the supported databases can be accessed using unified Javascript syntax.

1. PostgreSQL
2. MySQL
3. MariaDB
4. Oracle
5. SQLite


## Why to use an ORM?

ORM stands for Object-Relational Mapping, which provides convenient ways to access database layer from any given programming language.

With AdonisJs, you will never have to write SQL queries. Instead you call Javascript methods to interact with databases. Also, when you switch between multiple SQL database clients, your code will remain the same.

## Configuration

Configuring database is simple and controlled by a dedicated configuration file inside `config` directory.

With every new installation of AdonisJs, you will have `config/database.js` file. By default it is configured to make use of `sqlite`, but you are free to use any supported database client.

##### config/database.js

```javascript
'use strict'

const Helpers = use('Helpers')
const Env = use('Env')

module.exports = {

  connection: Env.get('DB_CONNECTION', 'sqlite'),

  sqlite: {
    client: 'sqlite3',
    connection: {
      filename: Helpers.storagePath('development.sqlite3')
    },
    debug: false
  },

  mysql: {
    client: 'mysql',
    connection: {
      host: Env.get('MYSQL_HOST', 'localhost'),
      user: Env.get('MYSQL_USER', 'root'),
      password: Env.get('MYSQL_PASSWORD', ''),
      database: Env.get('MYSQL_DATABASE', 'AdonisJs')
    }
  }
}
```

This is how database configuration file looks for a new application. In brief, this file contains multiple objects, each defining a unique connection for any database client.

## Default Connection

The first property that needs to be defined is `connection`. It accepts a string, which is a reference to a connection object within the same file.

For Example:

```javascript
module.exports = {
  connection: 'mysql',

  mysql: { ... }
}
```

Value defined next to the `connection` key will be used as the default database connection for your entire application.

## Database Settings

Below are the ways you can define settings for different database clients.

#### MySQL

One of the following libraries needs to be installed for using the mysql adapter.

[client: mysql](https://www.npmjs.com/package/mysql)

[client: mysql2](https://www.npmjs.com/package/mysql2)


```javascript
mysql: {
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'AdonisJs'
  }
}
```

If required, you can also provide socket path to the MySQL connection. Giving socket path will ignore the host and port options.

```javascript
mysql: {
  client: 'mysql',
  connection: {
    socketPath: '/path/to/socket.sock',
    user: 'root',
    password: '',
    database: 'AdonisJs'
  }
}
```

#### SQLite

SQLite binding needs to be installed for using the sqlite connection.

[client:sqlite3](https://www.npmjs.com/package/sqlite3)

```javascript
sqlite: {
  client: 'sqlite3',
  connection: {
    filename: Helpers.storagePath('dev.sqlite')
  }
}
```

#### PostgreSQL

PostgreSQL binding needs to be installed for using pg connection.

[client:pg](https://www.npmjs.com/package/pg)


```javascript
pg: {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: '',
    password: '',
    database: 'AdonisJs',
    ssl: false
  }
}
```

Or you can pass a connection string.

```javascript
pg: {
  client: 'pg',
  connection: 'postgres://user:password@host:port/database?ssl=true'
}
```

#### Oracle

One of the following bindings needs to be installed for using Oracle DB.

[client:oracle](https://www.npmjs.com/package/oracle)
[client:strong-oracle](https://www.npmjs.com/package/strong-oracle)


```javascript
oracle: {
  client: 'oracle',
  connection: {
    host: '127.0.0.1',
    port: 1521,
    user: '',
    password: '',
    database: 'AdonisJs'
  }
}
```

#### MariaDB

MariaDB binding should be installed before using the mariadb connection.

[client:mariasql](https://www.npmjs.com/package/mariasql)

```javascript
maria: {
  client: 'mariasql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'AdonisJs'
  }
}
```

## Global Settings

Apart from configuring individual database clients, you can also make use of some global settings, which are same for each database.

#### Pooling

All connections make use of pooling, which means once a connection has been created, it will be reused. It will improve the performance of your application.

By default minimum of 2 and maximum of 10 connections will be spawned for MySQL and PostgreSQL clients. SQLite will always have one open connection.

```javascript
module.exports = {
  client: 'mysql',
  connection: { ... },
  pool: {
      min: 0,
      max: 5
  }
}
```

#### Connection Timeout

Connection timeout is set to `60000ms` to determine how long to wait before throwing connection timeout error.

```javascript
module.exports = {
  client: 'mysql',
  connection: { ... },
  acquireConnectionTimeout: 60000
}
```


## Basic Example

Now as you know how to configure the database, let's check out how to make use of it to interact with a database.

##### app/Http/routes.js

```javascript
Route.get('/users', 'UserController.index')
```

##### app/Http/UserController.js

```javascript
const Database = use('Database')

class UserController {

	* index (request, response) {		
		const users = yield Database.select().from('users')
		response.json(users)
	}

}

module.exports = UserController
```

## Query Builder

Query builder is a chain of Javascript methods, which can be used to make a SQL query. Let's explore different ways to select a table and add where clause to it.

#### selecting table
```javascript
Database.table('users')
// or
Database.from('users')
```

#### adding where clause

```javascript
Database.table('users').where('username', 'doe')
```

What you have seen above is a query chain. Which means you can make use of multiple methods to make a query. Here is an example of a complete query.

```javascript
const users = yield Database
  .table('users')
  .where('age', 22)
  .orderBy('id', 'desc')
```

Above query chain is equivalent to following SQL query.

```sql
SELECT * FROM `users` WHERE `age` = 22 ORDER BY `id` DESC;
```

It is so easy to build up simple and complex queries using the query builder. The `yield` keyword will execute the query chain and will return the result back to assigned variable.

You can learn more about [Query Builder here](query-builder).

## Switching Database Connection

Switching database connection is one of the most common requirement while building multi-tenant apps. AdonisJs makes this process easier and let you use different connections on runtime.

Assuming you have defined following connections inside your config file.

```javascript
module.exports = {

  mysql: { ... },

  reportsMysql: { ... },

  personnaMysql: { ... }

}
```

Now to switch between database connections you will have to make use of the `connection` method.

#### connection

```javascript
yield Database
  .connection('personnaMysql')
  .table('users')
  .where('username', 'doe')
```


#### close

At times, you may want to use a connection for one time. So it is a good practice to close the connections you do not need anymore.

```javascript
Database.close('personnaMysql')
```


## Debugging

There are a handful of ways to debug database operations, so let's review all of them.

You can debug globally for a given connection by setting up debug property on your database connection settings.

```javascript
mysql: {
  client: 'mysql',
  connection: { ... },
  debug: true
}
```

Setting up `debug` on your connection property will log queries to your server console and gives you less control over the output. Alternatively, you can also listen the `query` or `sql` events.

```javascript
Database.on('query', console.log)
yield Database.from('users').where('username', 'doe')
```

or

```javascript
Database.on('sql', console.log)
yield Database.from('users').where('username', 'doe')
```

The difference between the sql and query event is the output they produce. `sql` event will print the actual query and time taken by the query.

##### sql event output
```sql
+ 1.38 ms : select * from `users` where `username` = 'doe'
```

##### query event output

```son
{
  method: 'select',
  options: {},
  bindings: [ 'doe' ],
  sql: 'select * from `users` where `username` = ?'
}
```

That's not all, you can also debug a single query by chaining the event listener.


```javascript
yield Database.on('sql', console.log)
  .table('users')
  .where('username', 'doe')
```

or

```javascript
yield Database.on('query', console.log)
  .table('users')
  .where('username', 'doe')
```

or

```javascript
yield Database.debug()
  .table('users')
  .where('username', 'doe')
```

Query event and debug method will have the same output, it is just that you can access the output of `query event`, however `debug` method will always write to the console.
