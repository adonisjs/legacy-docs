# Queries

Database provider supports simple queries to complex joins and streams for large data chunks. With right configuration settings you can use Database provider with zero setups.

Under the hood, it makes use of [knex](#http://knexjs.org/#Builder), and anything with knex is true with Database provider.



- [Selects](#selects)
- [Where Clauses](#where-clauses)
- [Join Methods](#join-methods)
- [Ordering, Limits ...](#ordering-limits-)
- [Inserts](#inserts)
- [Updates](#updates)
- [Deletes](#deletes)
- [Aggregates](#aggregates)
- [Helpers](#helpers)



## Selects

#### select <span>([columns])</span>
select takes an optional array of columns to fetch while making select query.

```javascript,line-numbers
yield Database.select('username','email').from('users')
```



#### from <span>(table) alias:table</span>
defines table to select from

```javascript,line-numbers
yield Database.from('users')
// or
yield Database.table('users')
// or
yield Database('users')
```



## Where clauses
Below methods give you an expressive vocabulary to add where clauses to query builder.


#### where <span>(~mixed~)</span>
Add where clause to query builder

```javascript,line-numbers
yield Database.where('id',1)
```

```javascript,line-numbers
yield Database.where({id:1})
```

```javascript,line-numbers
yield Database.where(function () {
  this.where('id',1)
})
```

```javascript,line-numbers
yield Database.where('age','>',20)
```

```javascript,line-numbers
yield Database.where('age','in',[18,40,56])
```


#### whereNot <span>(~mixed~)</span>
Adds where not clause to query builder.

```javascript,line-numbers
yield Database.whereNot('id',1)
```

```javascript,line-numbers
yield Database.whereNot({id:1})
```

```javascript,line-numbers
yield Database.whereNot('age','<',18)
```


#### whereIn <span>(column, array|callback|builder)</span>
Shorthand for `where('id', 'in', array)`

```javascript,line-numbers
yield  Database.whereIn('id',[10,20])
```

```javascript,line-numbers
yield Database.whereIn('id',[10,20]).orWhereIn('id',[30,40])
```

```javascript,line-numbers
const subquery = Database.select('id').from('accounts')
yield Database.from('users').whereIn('account_id',subquery)
```



#### whereNotIn <span>(column, array|callback|builder)</span>

```javascript,line-numbers
yield Database.whereNotIn('id',[10,20])
```

```javascript,line-numbers
yield Database.whereNotIn('id',[10,20]).whereNotIn('id',[30,40])
```

```javascript,line-numbers
const subquery = Database.select('id').from('accounts')
yield Database.from('users').whereNotIn('account_id',subquery)
```



#### whereNull <span>(column)</span>

```javascript,line-numbers
yield Database.whereNull('deleted_at')
```

```javascript,line-numbers
yield Database.whereNull('deleted_at').orWhereNull('updated_at')
```


#### whereNotNull <span>(column)</span>

```javascript,line-numbers
yield Database.whereNotNull('deleted_at')
```

```javascript,line-numbers
yield Database.whereNotNull('deleted_at').whereNotNull('updated_at')
```


#### whereExists <span>(builder|callback)</span>

```javascript,line-numbers
yield Database('users').whereExists(function () {
  this.select('*').from('accounts').where('users.account_id','accounts.id')
})
```


#### whereNotExists <span>(builder|callback)</span>

```javascript,line-numbers
yield Database('users').whereNotExists(function () {
  this.select('*').from('accounts').where('users.account_id','accounts.id')
})
```


#### whereBetween <span>(column,range)</span>

```javascript,line-numbers
yield Database('users').whereBetween('votes',[1,100])
```


#### whereNotBetween <span>(column,range)</span>

```javascript,line-numbers
yield Database('users').whereNotBetween('votes',[1,100])
```



#### whereRaw <span>(query,bindings)</span>

```javascript,line-numbers
yield Database('users').whereRaw('id = ?',[1])
```


## Join Methods
Use below methods to define joins between multiple database tables.

#### innerJoin <span>(column,~mixed~)</span>

```javascript,line-numbers
yield Database('users').innerJoin('accounts','users.id','accounts.user_id')
```

```javascript,line-numbers
yield Database('users').innerJoin('accounts',function () {
  this.on('accounts.id','users.account_id').orOn('accounts.owner_id','users.account_id')
})
```


#### leftJoin <span>(column,~mixed~)</span>
Same interface as innerJoin

```javascript,line-numbers
yield Database('users').leftJoin('accounts','users.id','accounts.user_id')
```


#### leftOuterJoin <span>(column,~mixed~)</span>

```javascript,line-numbers
yield Database('users').leftOuterJoin('accounts','users.id','accounts.user_id')
```

```javascript,line-numbers
yield Database('users').leftOuterJoin('accounts', function() {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id')
})
```


#### rightJoin <span>(column,~mixed~)</span>

```javascript,line-numbers
yield Database('users').rightJoin('accounts','users.id','accounts.user_id')
```

```javascript,line-numbers
yield Database('users').rightJoin('accounts', function() {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id')
})
```



#### rightOuterJoin <span>(column,~mixed~)</span>

```javascript,line-numbers
yield Database('users').rightOuterJoin('accounts','users.id','accounts.user_id')
```

```javascript,line-numbers
yield Database('users').rightOuterJoin('accounts', function() {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id')
})
```



#### outerJoin <span>(column,~mixed~)</span>

```javascript,line-numbers
yield Database('users').outerJoin('accounts','users.id','accounts.user_id')
```

```javascript,line-numbers
yield Database('users').outerJoin('accounts', function() {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id')
})
```



#### fullOuterJoin <span>(column,~mixed~)</span>

```javascript,line-numbers
yield Database('users').fullOuterJoin('accounts','users.id','accounts.user_id')
```

```javascript,line-numbers
yield Database('users').fullOuterJoin('accounts', function() {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id')
})
```


#### crossJoin <span>(column,~mixed~)</span>

```javascript,line-numbers
yield Database('users').crossJoin('accounts','users.id','accounts.user_id')
```

```javascript,line-numbers
yield Database('users').crossJoin('accounts', function() {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id')
})
```


#### joinRaw <span>(sql,[bindings])</span>

```javascript,line-numbers
yield Database('users').joinRaw('natural full join table1').where('id', 1)
```

```javascript,line-numbers
yield Database.select('*').from('accounts').join(Database.raw('natural full join table1')).where('id', 1)
```


## Ordering, Limits ...

#### distinct
```javascript,line-numbers
yield Database('users').distinct('age').select()
```


#### groupBy <span>(names)</span>
```javascript,line-numbers
yield Database('users').groupBy('age')
```


#### orderBy <span>(column,direction)</span>
```javascript,line-numbers
yield Database('users').orderBy('id','desc')
```


#### having <span>(column,operator,value)</span>
```javascript,line-numbers
yield Database('users').having('count','>',10)
```


#### offset <span>(value)</span>
```javascript,line-numbers
yield Database('users').offset(0)
```


#### limit <span>(value)</span>
```javascript,line-numbers
yield Database('users').limit(20).offset(0)
```


#### union <span>(queries,[wrap])</span>
Creates a union query using an array or list of callbacks with optional wrap values
set's to false by default.

```javascript,line-numbers
yield Database('users').whereNull('last_name').union(function () {
  this.from('users').whereNull('first_name')
})
```


#### unionAll <span>(queries,[wrap])</span>
Same interface as union

```javascript,line-numbers
yield Database('users').whereNull('last_name').unionAll(function () {
  this.from('users').whereNull('first_name')
})
```


## Inserts

#### insert <span>(data,[returning])</span>
Adds a new row to defined table, and can return an array of fields which only works for
PostgreSQL.

```javascript,line-numbers
yield Database('users').insert({username:'foo'})
// or
yield Database('users').insert({username:'foo'},'id')
```


#### bulk inserts <span>(data,[returning])</span>
You can insert an array of objects to bulk insert rows.

```javascript,line-numbers
yield Database('users').insert([{username:'foo'},{username:'bar'}])
```


#### returning <span>(column)</span>
You can also define field to be returned after insert , which only works for PostgreSQL.

```javascript,line-numbers
yield Database('users').returning('id').insert({username:'foo'})
```



## Updates

#### update <span>(data,[returning]) / (key, value, [returning])</span>
Update one or multiple rows based upon selected rows using query builder.

```javascript,line-numbers
yield Database('users').where('age', '>', 18).update({allowed:1})
// or
yield Database('users').where('age', '>', 18).update('allowed',1)
```


## Deletes

#### delete <span>(alias:del)</span>
Delete rows from a given table , also you can build a query using where clause and delete selected rows only.

```javascript,line-numbers
yield Database('users').where('age','<',18).del()
// or
yield Database('users').where('age','<',18).delete()
```

#### truncate
Remove all rows from a given table using truncate command.

```javascript,line-numbers
yield Database('users').truncate()
```


## Aggregates
Using provider you can make use of aggregate methods like `max`, `min` , `increment` , `decrement` etc.

#### count <span>(column)</span>

```javascript,line-numbers
yield Database('users').count()
// or
yield Database('users').count('active')
// or
yield Database('users').count('active as a')
```


#### min <span>(column)</span>

```javascript,line-numbers
yield Database('users').min('age')
// or
yield Database('users').min('age as a')
```


#### max <span>(column)</span>

```javascript,line-numbers
yield Database('users').max('age')
// or
yield Database('users').max('age as a')
```


#### sum <span>(column)</span>

```javascript,line-numbers
yield Database('users').sum('products')
// or
yield Database('users').sum('products as p')
```


#### avg <span>(column)</span>

```javascript,line-numbers
yield Database('users').avg('age')
// or
yield Database('users').avg('age as a')
```


#### increment <span>(column,amount)</span>

```javascript,line-numbers
yield Database('users').where('id',1).increment('health',10)
```


#### decrement <span>(column,amount)</span>

```javascript,line-numbers
yield Database('users').where('id',1).decrement('health',10)
```


## Helpers

Database provider also supports some commonly used helpers to make it easier for you to manipulate data while making queries.

#### pluck <span>(column)</span>
```javascript,line-numbers
const userIds = yield Database('users').pluck('id')
```


#### first <span>(columns)</span>
It only selects the first matching row and returns an object instead of array. Optionally you can pass
fields to be selected.

```javascript,line-numbers
yield Database('users').first()
// or
yield Database('users').first('id','username','email')
```


#### columnInfo <span>([columns])</span>

Returns an object of columns with their type definition from selected table

```javascript,line-numbers
yield Database('users').columnInfo()
```
