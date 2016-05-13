---
title: Database Advanced Query Builder
description: Adonis database advanced query builder
permalink: query-builder-advanced
weight: 0
categories:
    - Database
versions:
    - 3.0
---

{{TOC}}

# Advanced Query Builder

This guide will cover some advanced and interesting features of query builder.

By the end of this guide, you will know:

1. How to wrap database operations inside transactions.
2. How to paginate results.
3. How to load a chunk of data.

## Database Transactions

Database transactions are safe operations, which are not reflected in the database until and unless you explicitly commit your changes.

Adonis Database provider offers a couple of ways to make use of transactions.

### Globally begin Transaction

`beginTransaction` method will return the transaction object, which can be used to perform any queries. 

Same returned object will be used to commit or roll back changes.

```javascript
const trx = yield Database.beginTransaction()
yield trx.insert({username: 'virk'}).into('users')

trx.commit() // insert query will take place on commit

```

To cancel the database operations, you can make use of `rollback` method.

```javascript
const trx = yield Database.beginTransaction()
yield trx.insert({username: 'virk'}).into('users')

trx.rollback() // nothing will happen
```

### Wrap transaction inside a closure

Also, you can wrap your transactions inside a callback. The major difference is, you will not have to call `commit` or `rollback` inside a closure. If any of your queries inside a closure returns an error, the transaction will rollback automatically. Otherwise, it will commit.

```javascript
yield Database.transaction(function * (trx) {
    yield trx.insert({username: 'virk'}).into('users')
})
```

## Pagination

Query builder provides a couple of convenient ways to paginate results from the database.

### forPage

`forPage` methods accepts two parameters to pull limited results from the database.

argument | required | defaultValue
--------|-----------|------------
page | yes | |
limit | no | 20

```javascript
yield Database
    .from('users')
    .forPage(1)
    
// outputs
select * from `users` limit 20

// returns
[{username: 'virk'} ...]
```

Also, you can define the number of results to fetch.

```javascript
yield Database
    .from('users')
    .forPage(2, 10)

// outputs
select * from `users` limit 10 offset 10
```

### paginate

Paginate works the same way as `perPage` but the difference is output returned by both of them.

```javascript
const results = yield Database
    .from('users')
    .paginate(2, 10)

// outputs
select count(*) as `total` from `users`
select * from `users` limit 10 offset 10

// returns
{ 
    total: 0,
    currentPage: 2,
    perPage: 10,
    lastPage: 0,
    data: [...]
}
```

Paginate returns the metadata with actual results and can be helpful to create pagination links inside your views.

## Chunks

### chunk

`chunk` method will pull records in small chunks and will execute the `closure` until there are results. This method is helpful when you are planning to select thousands of records.

```javascript
yield Database.from('logs').chunk(200, function (logs) {
    console.log(logs)
})
```
