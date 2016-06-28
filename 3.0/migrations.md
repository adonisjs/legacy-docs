---
title: Migrations
permalink: migrations
description: AdonisJs Database migrations
weight: 2
categories:
- database
---

{{TOC}}

Database Migrations is a process of creating, altering and dropping database tables from code, instead of writing SQL queries. AdonisJs has out of the box support for database migrations so that you can set up your database tables using the Javascript code.

## Introduction

The **naive** approach of database management is to manually create the SQL database tables, which works but it is not great as it requires a lot of manual re-work.

Let's take an example of a standard procedure of creating database tables.

1. Login to SequelPro(or similar) and create database tables.
2. Now when someone wants to work on the same application, you need to share the database schema or dump with them.
3. When they make some changes in the database, they have to re-share the new database dump with you.
4. You cannot run automated tests on TravisCI(or similar) as you need access to the server to create the database tables.
5. Finally, when deploying the app in production you need to make a remote connection to your server database to create those tables manually.

This approach is bad is every sense. That is why **migrations** are there to automate the entire flow with minimal efforts.

With migrations SQL schema is part of your code base, which means when your peers will check out the code from git, they will get the database schema with it and any progressive changes made by them are available to you.

## Basic Example

Now as you know about the benefits of migrations, let's take a closer look on how to create SQL database tables using Javascript.

```bash
./ace make:migration users --create=users
```

Output

```bash
create: database/migrations/1464437815620_users.js
```


##### database/migrations/1464437815620_users.js

```javascript
'use strict'

const Schema = use('Schema')

class UsersSchema extends Schema {

  up () {
    this.create('users', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }

}

module.exports = UsersSchema
```

Migrations are stored inside `database/migrations` directory and each schema file is an `ES2015` class with 2 required methods **up** and **down**. `up` is used when you run your migrations to create or alter a database table, whereas `down` is executed when you rollback your previous migration. Think of it as undoing the changes you made.

For the most basic example, you will create a new table inside the `up` method and will drop the same table inside `down` method.

## Running Migrations

Migrations are executed in batches using the `ace` command.

```
./ace migration:run
```

It is recommended to work with incremental migrations, instead of modifying the same schema file every time. For example

1. Create a new schema file when you want to create a new table.
2. Down the line, you realized that you need 2 extra fields in the same table. Create a new schema file to alter the existing table and add those 2 new fields.
3. Again after few days, you have a requirement to rename an existing field. Create a new schema file for that also.

Incremental migrations help you in tracking changes like Version control. When writing code, it is a good practice to make small code commits, so that you have cleaner code history. You must treat your migrations the same way.

## Migrations Commands

Below is the list of ace commands specific to migrations only.

| Command | Options | Purpose |
|---------|---------|---------|
migration:run | none | Run all pending migrations by executing `up` method of all schema files. |
| migration:rollback | batch  | Rollback migrations to a given batch or default to last batch.|
| migration:refresh | none | Refresh migrations by dropping and re-running all migrations
| migration:reset | none | Rollback to the initial state.
| migration:status | none | Check the current status of migrations.


## Interacting With Tables

Below is the list of methods can be used to interact with database tables. 

#### create(tableName, callback)

Create a new database table.

```javascript
class UserSchema {

    up () {
        this.create('users', (table) => {
            ...
        })
    }

}
```

#### createIfNotExists(tableName, callback)

```javascript
this.createIfNotExists('users', (table) => {
    ...
})
```


#### rename(from, to)

Rename an existing database table.

```javascript
this.rename('users', 'my_users')
```

#### drop(tableName)

Drop an existing database table.

```javascript
this.drop('users')
```

#### dropIfExists(tableName)

```javascript
this.dropIfExists('users')
```


#### has(tableName)

```javascript
this.has('users').then((exists) => {
    ...
})
```

#### table(tableName, callback)

Select a table for alternation

```javascript
this.table('users', (table) => {
    table.dropColumn('deleted_at')
})
```

#### raw

Run an arbitrary SQL query in the schema builder chain

```javascript
this
    .raw('SET sql_mode="TRADITIONAL"')
    .create('users', (table) => {
        table.increments()
    })
```

## Schema Builder

Please refer to the docs of [Knex Schema Building](http://knexjs.org/#Schema-Building), everything from knex is fully supported. Below is the example making use of schema builder to create `users` table.

```javascript
'use strict'

const Schema = use('Schema')

class UsersSchema extends Schema {

  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username').unique()
      table.string('email').unique()
      table.string('password', 60)
      table.timestamps()
      table.softDeletes()
    })
  }

  down () {
    this.drop('users')
  }

}

module.exports = UsersSchema
```