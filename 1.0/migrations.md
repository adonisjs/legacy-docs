# Migrations

Migration is a process of building database schema over time. Instead of writing schema definition in raw SQL files, you can make use of `Javascript` syntax to create the database schema. 

Not only it gives the flexibility to create the schema using `Javascript`, but it also makes it easier to maintain schema when working within a team.



- [Overview](#overview)
- [Ace Commands](#ace-commands)
- [Query Methods](#query-methods)
  - [Modifying Building](#table-building)
  - [Schema Building](#schema-building)
  - [Chainable](#chainable)



## Overview

If you are new to migrations, they may seem little confusing to you. For the bare minimum think of them as SQL schema written in Javascript but with version control.

Each migration represents a version of your database state, where you can modify the schema in every version you can also rollback to the previous version whenever required.

```javascript,line-numbers
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users',function (table) {
      table.increments('id')
      table.string('username')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
  ])
};
```

Schema files have two required functions `up` and `down`.

### up

`up` method is executed when you run your migrations and is helpful for creating/modifying schema. Above we created
a table called `users` using `createTable` method and defined multiple fields with their attributes.

### down

`down` method is executed when you rollback your migrations and is always opposite of `up` method. Above we are dropping table users using `dropTable` method. 



## Ace Commands

Ace commands will help you in automating the process of setting up migrations.

### make 
create a new migration file.

```bash,line-numbers
node ace migration:make create_users_table
```

### run
Execute batch of migrations to setup schema. Each run will create a unique version of your database schema.

```bash,line-numbers
node ace migration:run
```

### rollback
rollback to the previous version.

```bash,line-numbers
node ace migration:rollback
```



## Query Methods

Query methods will help you in defining your schema definition using javascript methods.



### Modifying Table

Below methods will let you manipulate tables definition over time.

#### createTable <span>(tableName,callback)</span>

```javascript,line-numbers
knex.schema.createTable('users', function (table) {
  ...
})
```

#### renameTable <span>(from,to)</span>

```javascript,line-numbers
knex.schema.renameTable('users', 'my_users')
```

#### dropTable <span>(tableName)</span>

```javascript,line-numbers
knex.schema.dropTable('my_users')
```

#### hasTable <span>(tableName)</span>

```javascript,line-numbers
knex.schema.hasTable('my_users').then(function (exists) {
  if(!exists){
    return knex.schema.createTable(...)
  }
})
```

#### dropTableIfExists <span>(tableName)</span>

```javascript,line-numbers
knex.schema.dropTableIfExists('users')
```

#### table <span>(tableName,callback)</span>

Select database table for modification

```javascript,line-numbers
knex.schema.table('users', function (table) {
  table.dropColumn('email')
  table.string('email_address',255)
})
```

#### raw <span>(statement)</span>

Runs any SQL query in schema builder chain.

```javascript,line-numbers
knex.schema
  .raw("SET sql_mode='TRADITIONAL'")
  .table('users', function (table) {
    ...
  })
```



### Schema Building

Schema building will let you define attributes on table columns/fields. 

#### dropColumn <span>(name)</span>

```javascript,line-numbers
table.dropColumn('email')
```

#### dropColumns <span>(*names)</span>

```javascript,line-numbers
table.dropColumns('email','password')
```

#### renameColumn <span>(from,to)</span>

```javascript,line-numbers
table.renameColumn('email','email_address')
```

#### increments <span>(name)</span>

Adds an auto-incrementing column and will be used as primary key.In PostgreSQL, this is a `serial` and for
`bigIncrements` you can make use of `bigserial` ( PostgreSQL only ).

```javascript,line-numbers
table.increments('id')
```

#### integer <span>(name)</span>

```javascript,line-numbers
table.integer('age')
```

#### bigInteger <span>(name)</span>

<div class="__note">
  <p><strong>Note: </strong> This will be return as a string as Javascript may not be able to parse it without precision loss.</p>
</div>

```javascript,line-numbers
table.bigInteger('account_balance')
```

#### text <span>(name,textType=text)</span>

```javascript,line-numbers
table.text('bio','longtext')
```

#### string <span>(name,length=255)</span>

```javascript,line-numbers
table.string('email_address',255)
```

#### float <span>(name,precision?,scale?)</span>

```javascript,line-numbers
table.float('marks',3,2)
```

#### decimal <span>(name,precision?,scale?)</span>

```javascript,line-numbers
table.decimal('temperature',4,2)
```

#### boolean <span>(name)</span>

```javascript,line-numbers
table.boolean('admin')
```

#### date <span>(name)</span>

```javascript,line-numbers
table.date('published_on')
```

#### dateTime <span>(name)</span>

```javascript,line-numbers
table.dateTime('created_at')
```

#### time <span>(name)</span>

```javascript,line-numbers
table.time('wakeup_at')
```

#### timestamp <span>(name,standard=false)</span>

defaults to `timestamptz` in PostgreSQL unless `true` is passed as second argument.

<div class="__note">
  <p><strong>Note: </strong> `.defaultTo` varies from database to database. PostreSQL requires `.defaultTo(knex.raw('now()'))` whereas SQLite3 requires `.defaultTo(knex.raw("date('now')"))` </p>
</div>

```javascript,line-numbers
table.timestamp('born_at')
```

#### timestamps

quick way to setup `created_at` and `updated_at` timestamps.

```javascript,line-numbers
table.timestamps()
```

#### binary <span>(name,length?)</span>

```javascript,line-numbers
table.binary('image')
```

#### enu,enum <span>(name,values)</span>

```javascript,line-numbers
table.enum('status',['draft','published'])
```

#### json <span>(name,jsonb=false)</span>

Creates a JSON column, using `json` type in PostgreSQL and defaulting to text for older versions or non-supportive
databases.

```javascript,line-numbers
table.enum('status',['draft','published'])
```

#### uuid <span>(name)</span>

Creates a UUID column, using `UUID` type in PostgreSQL and defaulting to `char(36)` for non-supportive databases.

```javascript,line-numbers
table.uuid('ssn')
```

#### engine <span>(value)</span>

Sets database engine, only works with `createTable` command and applicable to MySQL only.

```javascript,line-numbers
table.engine('InnoDB')
```

#### charset <span>(value)</span>

Sets database charset, only works with `createTable` command and applicable to MySQL only.

```javascript,line-numbers
table.charset('utf8')
```

#### collate <span>(value)</span>

Sets database collate, only works with `createTable` command and applicable to MySQL only.

```javascript,line-numbers
table.collate('utf8_unicode_ci')
```

#### specificType <span>(name,value)</span>

Sets specific type for a given column, it can be useful for setting types not supported by the API here.

```javascript,line-numbers
table.specificType('coordinates','POLYGON')
```



### Chainable

Below methods are chainable and helpful for defining extra attributes on databases fields/columns.

#### index <span>(indexName,indexType)</span>

```javascript,line-numbers
table.integer('phone_number').index('phone_search','BTREE')
```

#### primary

```javascript,line-numbers
table.primary()
```

#### primary

```javascript,line-numbers
table.string('email_address').unique()
```

#### references <span>(column)</span>

```javascript,line-numbers
table.integer('user_id').references('id')
```

#### inTable <span>(table)</span>

```javascript,line-numbers
table.integer('user_id').references('id').inTable('users')
```

#### onDelete <span>(command)</span>

```javascript,line-numbers
table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
```

#### onUpdate <span>(command)</span>

```javascript,line-numbers
table.integer('user_id').references('id').inTable('users').onUpdate('CURRENT_TIMESTAMP')
```

#### defaultTo <span>(value)</span>

```javascript,line-numbers
table.boolean('admins').defaultTo(false)
```

#### unsigned

```javascript,line-numbers
table.integer('age').unsigned()
```

#### notNullable

```javascript,line-numbers
table.string('email_address').notNullable()
```

#### first

Keep column at first position

```javascript,line-numbers
table.increments('id').first()
```

#### after <span>(field)</span>

```javascript,line-numbers
table.string('email_address').after('id')
```

#### comment <span>(text)</span>

```javascript,line-numbers
table.string('email_address').comment('This is users email address to login')
```