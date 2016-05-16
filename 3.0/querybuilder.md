---
title: Query Builder
description: Adonis database query builder
permalink: query-builder
weight: 1
categories:
- Database
---

AdonisJs Query builder gives you a unified syntax to interact with SQL databases using Javascript methods. This guide is a reference to all the available methods on query builder.

Checkout out [Database Setup](database-setup) to check list of supported databases and configuration options.

## Introduction

Writing SQL queries can be tedious in so many ways, even if you are good with SQL.

Let's imagine you write all of your queries for MySQL and after some time your manager asks you to migrate everything to PostgreSQL. Now you will have to re-write/amend your MySQL queries to make sure they work well with PostgreSQL.

Another issue can be of building queries incrementally, Let's say your application you have conditional blocks to make incremental queries.

##### Without Query Builder

```javascript
const sql = 'SELECT * FROM `users`'

if (username) {
  sql += ' WHERE `username` = ' + username
}
```

##### With Query Builder
```javascript
const query = Database.table('users')

if (username) {
 query.where('username', username)
}
```

Hope you can note the difference. In this guide, you will learn the different ways of building query chain to achieve desired results.

## Selects

#### select

select will define the fields to be selected for a given SELECT query.

```javascript
yield Database.select('id', 'username').from('users')

// Output - select `id`, `username` from `users`
```


## Where Clauses

There are a handful of methods to add where clause to a query chain.

#### where(~mixed~)

Below are the different ways to build a where clause.

```javascript
yield Database.from('users').where('id', 1)

// Output - select * from `users` where `id` = 1
```

Or

```javascript
yield Database.from('users').where({ id: 1 })

// Output - select * from `users` where `id` = 1
```

You can also add a callback to the `where` clause. Callback outputs a little different SQL query, and will group all where clauses inside a callback.

```javascript
yield Database.from('users').where(function () {
  this.where('id', 1)
})

// Output - select * from `users` where (`id` = 1)
```

##### Defining where operator

Above queries by default will use `=` operator, you can override it by introducing a 3rd parameter.

```javascript
yield Database.from('users').where('age', '>', 20)

// Output - select * from `users` where `age` > 20
```

##### Sub Queries

You can also create SQL subqueries.

```javascript
const subquery = Database
  .from('accounts')
  .where('account_name', 'somename')
  .select('account_name')

const users = yield Database
  .from('users')
  .whereIn('id', subquery)

/* Output - 
select * from `users` where `id` in (select `account_name` from `accounts` where `account_name` = 'somename')
*/
```

#### whereNot(~mixed~)

`whereNot()` has the same signature as `where()`.

```javascript
yield Database.from('users').whereNot('age', '>', 20)

// Output - select * from `users` where not `age` > 20
```


#### whereIn(~mixed~)
`whereIn()` has same signature as `where()`.

```javascript
yield Database.from('users').whereIn('id', [1,2,3])

// Output - select * from `users` where `id` in (1, 2, 3)
```


#### whereNotIn(~mixed~)
`whereNotIn()` has same signature as `where()`.

```javascript
yield Database.from('users').whereNotIn('id', [1,2,3])

// Output - select * from `users` where `id` not in (1, 2, 3)
```

#### whereNull(~mixed~)

```javascript
yield Database.from('users').whereNull('deleted_at')

// Output - select * from `users` where `deleted_at` is null
```

#### whereNotNull(~mixed~)

```javascript
yield Database.from('users').whereNotNull('deleted_at')

// Output - select * from `users` where `deleted_at` is not null
```

#### whereExists(~mixed~)

```javascript
yield Database.from('users').whereExists(function () {
  this.from('accounts').where('users.id', 'accounts.user_id')
})

/* Output - 
select * from `users` where exists (select * from `accounts` where `users`.`id` = 'accounts.user_id')
*/
```

#### whereNotExists(~mixed~)

```javascript
yield Database.from('users').whereNotExists(function () {
    this.from('accounts').where('users.id', 'accounts.user_id')
})

/* Output - 
select * from `users` where not exists (select * from `accounts` where `users`.`id` = 'accounts.user_id')
*/
```

#### whereBetween(~mixed~)

```javascript
yield Database.table('users').whereBetween('age',[18,32])

// Output - select * from `users` where `age` between 18 and 32
```

#### whereNotBetween(~mixed~)

```javascript
yield Database.table('users').whereNotBetween('age',[18,32])

// Output - select * from `users` where `age` not between 18 and 32
```

#### whereRaw(~mixed~)

`whereRaw()` method will let you write a raw SQL where clause.

```javascript
yield Database.from('users').whereRaw('id = ?', [20])

// Output - select * from `users` where id = 20
```

## Joins

Just like `where clauses` they are a handful of join methods to write SQL joins.

#### innerJoin(column, ~mixed~)

```javascript
yield Database.table('users').innerJoin('accounts', 'user.id', 'accounts.user_id')

// Output - select * from `users` inner join `accounts` on `users`.`id` = `accounts`.`user_id`
```

You can also attach callback to the `innerJoin`.

```javascript
yield Database.table('users').innerJoin('accounts', function () {
  this
    .on('users.id', 'accounts.user_id')
    .orOn('users.id', 'accounts.owner_id')
})

/* Output - 
select * from `users` inner join `accounts` on `users`.`id` = `accounts`.`user_id` or `users`.`id` = `accounts`.`owner_id`
*/
```

### Other joins methods

All the join methods have the same signature as `innerJoin()` method.
- leftJoin
- leftOuterJoin
- rightJoin
- rightOuterJoin
- outerJoin
- fullOuterJoin
- crossJoin
- joinRaw

## Ordering and Limits

#### distinct(...columns)

```javascript
yield Database.table('users').distinct('age')

// Output - select distinct `age` from `users`
```

#### groupBy(...columns)

```javascript
yield Database.table('users').groupBy('age')

// Output - select * from `users` group by `age`
```

#### orderBy(column, [direction])

```javascript
yield Database.table('users').orderBy('id', 'desc')

// Output - select * from `users` order by `id` desc
```

#### having(column, operator, value)

`groupBy()` clause is always required before making use of `having()` method.

```javascript
yield Database.table('users').groupBy('age').having('age', '>', 18)

// Output - select * from `users` group by `age` having `age` > 18
```

#### offset and limit(value)

setting offset to `0` will ignore the offset.

```javascript
yield Database.table('users').offset(1).limit(10)

// Output - select * from `users` limit 10 offset 1
```

## Inserts

Insert operation will return the id of the newly inserted row. For bulk inserts, it will return the id of the last insert.

Also, you can make use of `into` method to define the table. There are no hard rules on which method to use while defining the table. However `into` seems more natural while inserting records.

All of the followings are valid.

```javascript
Database.table('users').insert(...)
Database.from('users').insert(...)

// this seems more natural
Database.insert(...).into('users')
```

##### PostgreSQL Only

For PostgreSQL, you will have to define the returning column explicitly, all other database clients will ignore this statement.

```javascript
yield Database
  .insert({ username: 'virk' })
  .into('users')
  .returning('id')
```


#### insert

```javascript
yield Database
  .insert({ username: 'virk' })
  .into('users')

// Output - insert into `users` (`username`) values ('virk')
```

#### bulk inserts

You can pass an array of objects for bulk inserts.

```javascript
yield Database
  .insert([{ username: 'virk' }, { username: 'doe' }])
  .into('users')
    
// Output - insert into `users` (`username`) values ('virk'), ('doe')
```

## Updates

All update operations will return the number of affected rows. 

```javascript
yield Database
  .table('users')
  .where('username', 'virk')
  .update('lastname', 'Virk')

// Output - update `users` set `lastname` = 'Virk' where `username` = 'virk'
```

Or for multiple columns you can pass an object.

```javascript
yield Database
  .table('users')
  .where('username', 'virk')
  .update({ lastname: 'Virk', firstname: 'Aman' })
    
// Output - update `users` set `firstname` = 'Aman', `lastname` = 'Virk' where `username` = 'virk'
```

## Deletes

Deletes operations will also return the number of affected rows.

#### delete

Also, you can make use of `del()`, which is an alias for `delete()` method.

```javascript
yield Database
  .table('users')
  .where('username', 'virk')
  .delete()

// Output - delete from `users` where `username` = 'virk'
```


#### truncate

Truncate will remove all the rows from a database and will set auto increment ids back to 0.

```javascript
yield Database.truncate('users')

// Output - truncate `users`
```

## Pagination

Query builder provides a couple of convenient ways to paginate results from the database.

#### forPage(page, [limit=20])

```javascript
yield Database
    .from('users')
    .forPage(1, 10)

// outputs
select * from `users` limit 10

// returns
[{username: 'virk'} ...]
```

#### paginate(page, [limit=20])

Paginate works the same way as `perPage` but the difference is output returned by both of them.

```javascript
const results = yield Database
    .from('users')
    .paginate(2, 10)

// Outputs
select count(*) as `total` from `users`
select * from `users` limit 10 offset 10

// Returns
{
    total: 0,
    currentPage: 2,
    perPage: 10,
    lastPage: 0,
    data: [...]
}
```

## Database Transactions

Database transactions are safe operations, which are not reflected in the database until and unless you explicitly commit your changes.

#### beginTransaction

`beginTransaction` method will return the transaction object, which can be used to perform any queries.

```javascript
const trx = yield Database.beginTransaction()
yield trx.insert({username: 'virk'}).into('users')

trx.commit() // insert query will take place on commit
trx.rollback() // will not insert anything
```

#### transaction(callback)

Also, you can wrap your transactions inside a callback. The major difference is, you will not have to call `commit` or `rollback` inside a closure. If any of your queries inside a closure returns an error, the transaction will rollback automatically. Otherwise, it will commit.

```javascript
yield Database.transaction(function * (trx) {
    yield trx.insert({username: 'virk'}).into('users')
})
```

## Chunks

`chunk` method will pull records in small chunks and will execute the closure until there are results. This method is helpful when you are planning to select thousands of records.

```javascript
yield Database.from('logs').chunk(200, function (logs) {
    console.log(logs)
})
```

## Aggregates

#### count([column])

```javascript
const total = yield Database.from('users').count()

// Output - select count(*) from `users`

// Returns - [ { 'count(*)': 1 } ]
```

Or

```javascript
const total = yield Database.from('users').count('id')

// Output - select count(`id`) from `users`

// Returns - [ { 'count(`id`)': 1 } ]
```

Or

```javascript
const total = yield Database.from('users').count('id as id')

// Output - select count(`id`) as `id` from `users`

// Returns - [ { id: 1 } ]
```

#### countDistinct([column])

`countDistinct()` is same as count, but adds distinct expression.

```javascript
const total = yield Database.from('users').countDistinct('id')

// Output - select count(distinct `id`) from `users`

// Returns - [ { 'count(distinct `id`)': 0 } ]
```

#### min(column)

```javascript
yield Database.from('users').min('age')
yield Database.from('users').min('age as a')

/* Output - 
select min(`age`) from `users`
select min(`age`) as a from `users`
*/
```

#### max(column)

```javascript
yield Database.from('users').max('age')
yield Database.from('users').max('age as a')

/* Output - 
select max(`age`) from `users`
select max(`age`) as a from `users`
*/
```

#### sum(column)

```javascript
yield Database.from('cart').sum('total')
yield Database.from('cart').sum('total as t')

/* Output - 
select sum(`total`) from `cart`
select sum(`total`) as t from `cart`
*/
```

#### sumDistinct(column)

```javascript
yield Database.from('cart').sumDistinct('total')
yield Database.from('cart').sumDistinct('total as t')

/* Output - 
select sum(distinct `total`) from `cart`
select sum(distinct `total`) as t from `cart`
*/
```

#### avg(column)

```javascript
yield Database.from('users').avg('age')
yield Database.from('users').avg('age as age')

/* Output - 
select avg(`age`) from `users`
select avg(`age`) as age from `users`
*/
```

#### avgDistinct(column)

```javascript
yield Database.from('users').avgDistinct('age')
yield Database.from('users').avgDistinct('age as age')

/* Output - 
select avg(distinct `age`) from `users`
select avg(distinct `age`) as age from `users`
*/
```

#### increment(column, amount)

Increment will add the given value to the existing value.

```javascript
yield Database
  .table('credits')
  .where('id', 1)
  .increment('balance', 10)
    
/* Output - 
update `credits` set `balance` = `balance` + 10 where `id` = 1
*/
```


#### decrement(column, amount)

Opposite of `increment`

```javascript
yield Database
  .table('credits')
  .where('id', 1)
  .decrement('balance', 10)
    
/* Output - 
update `credits` set `balance` = `balance` - 10 where `id` = 1
*/
```


## Helpers

#### pluck(column)

```javascript
const ids = yield Database.from('users').pluck('id')

// Output - select `id` from `users`

// Returns - [ 1, 2, 3, 4, 5, 6 ]
```

#### first

`first()` method will return the first matching row.

```javascript
yield Database.from('users').first()

// Output - select * from `users` limit 1
```

#### clone

It will clone the current query chain for re-usability.

```javascript
const query = Database
  .from('users')
  .where('username', 'virk')
  .clone()

// later
yield query
```

#### columnInfo([columnName])

Returns information for a given column.

```javascript
const username = yield Database.table('users').columnInfo('username')
 
// Output - PRAGMA table_info(users)
 
/* Returns - 
{
  type: 'varchar',
  maxLength: '255',
  nullable: true,
  defaultValue: null
}
*/
```
