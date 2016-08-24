---
title: Lucid
permalink: lucid
description: AdonisJs Database Models
weight: 0
categories:
- models
---

{{TOC}}

Lucid is an effective implementation of Active Record. Active Record itself is a pattern (not a language or tool). It helps you in reading and manipulating SQL data as objects and add domain logic to that data.
 
## Introduction

Lucid models are saved inside `app/Model` directory of your application. You can also make use of `ace` to create a model for you.

```bash
./ace make:model User
# on windows
ace make:model User
```

Each table in a database has a corresponding model.For example `users` table will have a `User` Model.

##### users (table)
```
+---------+-----------+--------------------+------------+
| id (PK) |  username |  email             | password   |
+---------+-----------+--------------------+------------+
| 1       |  unicorn  |  unicorns@ages.com | secret     |
| 2       |  lois     |  lois@oscar.com    | secret     |
+---------+-----------+--------------------+------------+
```

##### User (Lucid Model)
```javascript
'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
  // Your code
}
```

Models are simple `ES2015` classes and by extending `Lucid`, they inherit some default behavior and methods to manipulate data inside an SQL table.

While creating, reading, updating and deleting rows in a table you will execute methods on Model instance. Model instance is a representation of a single row, whose data is stored inside an object. For example:

```javascript
const user = new User()
user.username = 'Jenny'
user.email = 'Jenny@oscar.com'
user.password = 'top-secret'

yield user.save() // SQL Insert
```

Above you created an instance of the User model. It is crucial to understand that a model instance always belongs to a single row, which means you cannot do.

~~`const user = new User([{ username: '' }, { username: '' }])`~~

## Convention over Configuration

Models inherit a handful of properties from `Lucid` base class, which prevents you from re-writing the same code again and again. Only implement below methods if you want to change the default behavior of a model.

#### table

The table name is the plural underscore representation of your model class name.

| Model | table |
|--------|--------|
User | users
Person | people
PostComment | post_comments

You can modify the table name by overriding the `table` property in the model class.

```javascript
class User extends Model {

    static get table () {
        return 'my_users'
    }

}
```

#### primaryKey

Each model has a defined primary key, which defaults to `id`. Value for primary key is auto-populated by Lucid whenever you save a new model to the database. Also, the primary key is required to resolve model relations.

To override default value you can define a different primary key.
 
```javascript
class User extends Model {

    static get primaryKey () {
        return 'userId'
    }

}
```
 
#### connection
 
Connection parameter helps you in using different databases connection for a given model.

Database connections are defined inside `config/database.js` file. Lucid makes use of `default` connection defined under the same file. However, you can swap this value to use any defined connection from your database config file.

##### config/database.js
```javascript
module.exports = {
 
  connection: 'mysql',
 
  mysql: {
    ....
  },
 
  reportsMysql: {
    ...
  }

}
```

```javascript
class Report extends Mysql {
 
  static get connection () {
    return 'reportsMysql'
  }

}
```

## TimeStamps

Timestamps eliminate the need for setting up timestamps manually every time you create or update a record. Following timestamps are used for different database operations.

#### createTimestamp

Create timestamp defines the database field to be used for adding row creation time to the database table. You can override this property to specify a different field name or return `null` to disable it.

```javascript
class User extends Lucid {
  
  static get createTimestamp () {
    return 'created_at'
  }

}
```

#### updateTimestamp

Every time you modify a row in a database table `updateTimestamp` will be updated to the current time.

```javascript
class User extends Lucid {

  static get updateTimestamp () {
    return 'updated_at'
  }

}
```

##### deleteTimestamp

`deleteTimestamp` behaves a little different from *create* and *update* timestamps. You should only return value from this method if you want to make use of soft deletes.

```javascript

class User extends Lucid {

  static get deleteTimestamp () {
    return null
  }

}

```

Soft deletes is a term for deleting records by updating a delete timestamp instead of removing the row from the database.In other words, soft deletes are safe deletes, where you never lose data from your SQL tables. 

Soft deletes are disabled by default and to enable them, you must return an SQL table field name from `deleteTimestamp` method.

#### dateFormat

Date format specifies the format of date in which timestamps should be saved. Internally models will convert dates to [momentJs](http://momentjs.com/) instance. You can define any valid date format supported by momentJs.

```javascript
class User extends Lucid {

  static get dateFormat () {
    return 'YYYY-MM-DD HH:mm:ss'
  }

}
```

## Basic CRUD Operations

CRUD is a term used for Create, Read, Update and Delete records from a database table. Lucid models offer a handful of convenient methods to make this process easier.

You store your models inside `app/Model` directory of your application. To organize large projects you can also create subdirectories inside this directory.

Let's perform CRUD operations on a Post model which has an associated table called `posts`.

##### posts table
```
+------------+-----------------+
| name       |  type           |
+------------+-----------------+
| id (PK)    |  INTEGER        |  
| title      |  VARCHAR(255)   |
| body       |  TEXT           |
| created_at |  DATETIME       |
| updated_at |  DATETIME       |
+------------+-----------------+
```


You can create `Post.js` file manually or use `ace` command to generate this file for you.

```bash
./ace make:model Post
```

```javascript
const Lucid = use('Lucid')

class Post extends Lucid {
  // Your code
}
```

#### create

```javascript
const post = new Post()
post.title = 'Adonis 101'
post.body  = 'Adonis 101 is an introductory guide for beginners.'

yield post.save() // SQL Insert
```

`save()` method will persist the newly create record inside the database and will perform the following query.

```sql
INSERT INTO "posts" ("title", "body", "created_at", "updated_at") VALUES ('Adonis 101', 'Adonis 101 is an introductory guide for beginners.', '2016-02-20 13:30:13', '2016-02-20 13:30:13');
```

#### read

Reading is an operation divided into two segments. First, you want to fetch all the posts and second is to read a single post. There are specific methods to achieve the desired results, but for now, we will focus on `findBy()` method.

`findyBy()` is a dynamic method used with an identifier and will return the first matching result as a model instance for a given where clause.

```javascript
const post = yield Post.findBy('title','Adonis 101')
return post.toJSON()
```

Above method will perform following SQL query.
```sql
SELECT * FROM "posts" WHERE "title" = 'Adonis 101' LIMIT 1
```

#### update

The update operation is performed on an existing model instance. In general scenarios, you will have an id of a row that you want to update.

```javascript
const post = yield Post.findBy('id', 1)
post.body = 'Adding some new content'

yield post.save() // SQL Update
```

`save()` method is smart enough to find out whether to create a new record or to update the existing one and in this scenario it will perform following SQL query.

```sql
UPDATE "posts" SET "body" = 'Adding some new content', "updated_at" = '2016-02-20 13:54:46' WHERE "id" = 1;
```

#### delete

Delete operation is also performed on an existing model instance. If you have turned [softDeletes](#soft-deletes) on, then rows will not be deleted from SQL. However, the model instance will be considered deleted.

```javascript
const post = yield Post.findBy('id', 1)
yield post.delete()
```

Above method will perform following SQL query.
```sql
DELETE FROM "posts" WHERE "id" = 1;
```

Also, from this point model instance will freeze for edits, which means you can still read data from existing model instance but will not be able to edit it anymore.

```javascript
const post = yield Post.findById(1)
yield post.delete()

console.log(post.title) // Adonis 101

post.title = 'New title' // will throw RuntimeException
```

Congratulations, you have completed your first step towards using Lucid.

## Query Methods

Lucid internally makes use of [Database](query-builder) provider, which means all methods on Database provider are available to your models. Also, there are some additional methods attached to your models for convenience.

#### query

`query()` method returns an instance of Database provider, which means you build your queries with the same ease as would do with Database provider.

```javascript
yield Post.query().where('title', 'Adonis 101').fetch()
```

Above method will output following SQL query.

```sql
SELECT * FROM "posts" WHERE "title" = 'Adonis 101'
```

#### fetch

It is important to understand the role of `fetch` method. Fetch method will execute the query chain but also makes sure to return a collection of model instances.

Which means each item inside the collection array will not be a normal Object. Instead, it will be a fully qualified model instance.For example:

```javascript
const posts = yield Post.query().where('title', 'Adonis 101')
console.log(posts)
```

Above query will return an array of data.

```
[
  {
    id: 1,
    title: 'Adonis 101',
    body: 'Adonis 101 is an introductory guide for beginners.',
    created_at: '2016-02-20 17:59:25',
    updated_at: '2016-02-20 17:59:29'
  } 
]
```

Where calling fetch at the end of the query will have a different result set.

```javascript
const posts = yield Post.query().where('title', 'Adonis 101').fetch()
console.log(posts.value())
```

will output

```
[
  Post {
    attributes: {
      id: 1,
      title: 'Adonis 101',
      body: 'Adonis 101 is an introductory guide for beginners.',
      created_at: '2016-02-20 17:59:25',
      updated_at: '2016-02-20 17:59:29'
    },
    original: { ... }
  }
]
```

Later one is an array of model instances, which has its benefits. We will talk about them in a different guide.

#### first

`first()` is similar to fetch but it will always return the first matched result as a model instance.

```javascript
const post = yield Post.query().where('title', 'Adonis 101').first()
```

And above query will return a model instance if more than 1 row is found in the database. Otherwise, it will return `null`.

#### findBy

`findBy()` is a dynamic method used in conjunction with an attribute, for previously defined Post model we can do following.

```javascript
yield Post.findBy('title', '...')
yield Post.findBy('body', '...')
yield Post.findBy('id', '...')
```

behind the scenes, these methods will be converted to 

```javascript
yield Post.query().where('title', '...').limit(1).fetch()
yield Post.query().where('body', '...').limit(1).fetch()
yield Post.query().where('id', '...').limit(1).fetch()
```

#### findByOrFail

`findByOrFail()` is similar to **findBy** but will throw a `ModelNotFoundException` if no records are found for a given key.

It can become handy if you want to handle errors instead of doing manually check on whether the query response has any values or not.

```javascript
try {
  yield Post.findByOrFail('title', 'life of pie')
} catch (e) {
  response.send('Unable to find post with title life of pie')
}
```

#### find

`find()` is similar to `findBy()` but works little different. findBy is a dynamic method which works with any table attribute, whereas `find()` only works with the primary key of the table. For example:

```javascript
yield Post.find(1)
```

is equivalent to 

```javascript
yield Post.findBy('id', 1)
```

<div class="note"> <strong>Note</strong> - It works with the primary key, not the id, which means if the primary key of the table is something else instead of <code>id</code>, it will use that.</div>

```javascript
class Post extends Lucid {

  static get primaryKey () {
    return 'postId'
  }

}

yield Post.find(1)
```

Above method will output following SQL query.

```sql
SELECT * FROM "posts" WHERE "postId" = 1 LIMIT 1;
```


#### findOrFail

`findOrFail()` is similar to find but will throw a `ModelNotFoundException` if no records are found for a given primaryKey.

It can become handy if you want to handle errors instead of doing manually check on whether the query response has any values or not.

```javascript
try {
  yield Post.findOrFail(1)
} catch (e) {
  response.send('Unable to find post with id 1')
}
```

#### findOrCreate

`findOrCreate` will try to find a row with the given attributes and if nothing is found, it will create a new row and returns it back.

```javascript
const whereAttrs = {
  title: 'Adonis 101'
}

const values = {
  title: 'Adonis 101',
  body: 'Adonis 101 is a new guide to learn Adonis...'
}

yield Post.findOrCreate(whereAttrs, values)
```

#### paginate(page, [limit=20])

`paginate` over the rows. The output is similar to the query builder [paginate](query-builder#paginate-page-limit-20-)

```javascript
const page = request.input('page')
const posts = yield Post.paginate(page)

// or
const posts = yield Post.query().where('published', true).paginate(page)
```

#### pick(rows)

`pick()` method will return first `x` rows for a given model.

```javascript
yield Post.pick(2)
```

Above query is equivalent to the following query.

```javascript
yield Post.query().orderBy('id', 'asc').limit(2).fetch()
```

You can see the difference and amount of characters you save by using `pick()`.

#### pickInverse

`pickInverse()` works same as `pick()`. Instead, the query is executed with a `DESC` clause.

```javascript
yield Post.pickInverse(3)
```

and it will be equivalent to the following query.

```javascript
yield Post.query().orderBy('id', 'desc').limit(3).fetch()
```

#### all

`all()` is a shortcut method to return all rows for a given model.

```javascript
const posts = yield Post.all()
```

Above query is produce following SQL.

```sql
SELECT * FROM "posts";
```

#### ids

Returns an array of `primaryKeys` for a given model.

```javascript
const ids = yield Post.ids()

// returns
// [1, 2, 3, 4, 5, ...]
```

Also, you can grab `ids` for query builder chain

```javascript
const ids = yield Post.query().where('status', 'published').ids()
```

#### pair

`pair` returns a key/value pair of 2 fields. It can be very handy to populate HTML dropdowns.

```javascript
const countries = yield Country.pair('iso', 'name')

// returns
// {ind: 'India', uk: 'United Kingdom', ...}
```

Just like **ids**, `pair` can also be used with a query builder chain

```javascript
const asianCountries = yield Country.query().where('inAsia', true).pair('iso', 'name')
```

## Query Scopes

Query scopes are custom chainable query methods that you can define on Lucid Models. There are helpful in keeping your code expressive and DRY.

```javascript
'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
  
  static scopeActive (buider) {
    builder.where('status', 'active')
  } 

}
```

Above we defined a static `scopeActive` method, which receives the query builder instance that can be used to add clauses or modify query.

Now you can use this method when making queries of the `User` model.

```javascript
yield User.query().active().fetch()
```

executes following SQL query

```sql
select * from `users` WHERE `status` = ?
```

#### Some Rules

All query scope methods start with the keyword `scope` followed by the method name you want to call when running your queries.

| Query scope method | Usage with query builder |
|--------------|-------------------------|
| scopeActive | active |
| scopeLatest | latest |
| scopeCollaborators | collaborators|


## Transactions

Your models can make use of database transaction to perform **all or nothing** operations.

```javascript
const trx = yield Database.beginTransaction()

// USER
const user = new User()
user.username = 'foo'
user.email = 'foo@bar.com'
user.useTransaction(trx) // using transaction
const userSaved = yield user.save()

// PROFILE
const profile = new Profile()
profile.name = '@foo'
profile.avatar = 'http://gravatar.com/@foo'
profile.useTransaction(trx) // using transaction
const profileSaved = yield user.profile.save(profile)

if (userSaved && profileSaved) {
  trx.commit()
} else {
  trx.rollback()
}
```

Method `useTransaction` is available for all the given operations.

1. save
2. delete
3. restore

## Extending Models

Unfortunately, Javascript does not comes with all the goodness of extending classes. There is a good support for `extends` keyword but that is only limited to a single class. 

Lucid models, makes it easier to enhance/add properties to your models. You can call them **mixins** or **triats**. We prefer using the word **triats**. Traits helps you in enhancing your models by attaching properties/methods to it.

```javascript
const Slugify = use('Some-Slugify-Service')

class Post extends Lucid {
  
  static boot () {
    super.boot()
    this.use(Slugify)
  }

}
```

#### There are some rules

Ofcourse there needs to be some rules for writing traits for Lucid.

1. Triat should have a method called `register`. Which will receive the class as the only parameter.
2. Make sure to add methods/properties to the `prototype` of the class.

#### Example Trait

```javascript
const Slugify = exports = module.exports = {}

Slugify.register = function (model) {
  model.prototype.findBySlug = function (value) {
    return model.findBy('slug', value)
  }
  model.addHook('beforeCreate', Slugify.createSlug)
}

Slugify.createSlug = function * (next) {
  this.slug = slug(this.title) // making slug from title
}
```

Now inside your model you can `use` it.

```javascript
const Slugify = use('App/Services/Slugify')

class Post extends Lucid {
  
  static boot () {
    super.boot()
    this.use(Slugify)
  }

}
```

Also you can register it inside a static property called `traits`.

```javascript
class Post extends Lucid {

  static get traits () {
    return [
      'App/Services/Slugify'
    ]
  }

}
```

Also like any other part of your application, you can pass a `namespace` instead of the actual Object.
