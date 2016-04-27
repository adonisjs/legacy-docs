---
title: Lucid
description: Lucid description
permalink: lucid
weight: 2
categories:
    - Database
---

# Lucid

This is an introductory guide to Lucid ORM. After reading this guide, you will know:

1. What is Active Record?
2. How to use Models to perform database operations.
3. How to configure a Model to suit your needs.
4. Conventional methods to read and manipulate data.

Active Record is a pattern ( not a language or tool ). It helps you in reading and manipulating SQL data as objects and add domain logic to that data. 

Lucid is an effective implementation of active record. Which means you will never have to write plain SQL queries and all of your database operations will be handled inside Javascript.

Following is the list of databases supported by Lucid.

1. PostgreSQL
2. MySQL
3. MariaDB
4. Oracle
5. Sqlite

## Introduction

Lucid models are a combination of several pieces to retrieve and manipulate data as objects. Each table in a database has a corresponding model.

For example `users` table will have a `User` Model.

**users (table)**
```
+---------+-----------+--------------------+------------+
| id (PK) |  username |  email             | password   |
+---------+-----------+--------------------+------------+
| 1       |  unicorn  |  unicorns@ages.com | secret     |
| 2       |  lois     |  lois@oscar.com    | secret     |
+---------+-----------+--------------------+------------+
```

**User (Lucid Model)**
```javascript
class User extends Lucid {

}
```

Models are simple `ES6` classes and by extending `Lucid`, they inherit some default behaviour and methods to manipulate data inside an SQL table.

While creating, reading, updating and deleting rows in a table you will execute methods on Model instance.

Model instance is a representation of a single row, whose data is stored inside an object. For example:

```javascript
const user = new User()
user.username = 'Jenny'
user.email = 'Jenny@oscar.com'
user.password = 'top-secret'

yield user.save() // SQL INSERT
```

Above you created an instance of the User model. It is crucial to understand that a model instance always belongs to a single row, which means you cannot do.

~~`const user = new User([{username: ''}, {username: ''}])`~~

## Convention over Configuration

Models inherit a handful of properties from `Lucid` base class, which prevents you from re-writing the same code again and again. Only implement below methods if you want to change the default behaviour of a model.

### table()

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

### primaryKey()

Each model has a defined primary key, which defaults to `id`. Value for primary key is auto-populated by Lucid whenever you save a new model to the database. Also primary key is required to resolve model relations.

To override default value you can define a different primary key.
 
```javascript
class User extends Model {

    static get primaryKey () {
        return 'userId'
    }

}
```
 
### connection()
 
Connection parameter helps you in using multiple databases within a single application. Each model can have a different database connection. 

Database connections are defined inside `config/database.js` file. Lucid makes use of `default` connection defined under the same file. However, you can swap this value to use any defined connection from your database config file.

**config file**
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

### timestamps

Timestamps eliminate the need for setting up timestamps manually every time you create or update a record. Following timestamps are used for different database operations.

**createTimestamp()**

Create timestamp defines the database field to be used for adding row creation time to the database table. You can override this property to specify a different field name or return `null` to disable it.

```javascript
class User extends Lucid {
  
    static get createTimestamp () {
        return 'created_at'
    }

}
```

**updateTimestamp()**

Every time you modify a row in a database table `updateTimestamp` will be updated to the current time.

```javascript
class User extends Lucid {

    static get updateTimestamp () {
        return 'updated_at'
    }

}
```

**deleteTimestamp**

`deleteTimestamp` behaves a little different from create and update timestamps. You should only return value from this method if you want to make use of soft deletes.

```javascript

class User extends Lucid {

    static get deleteTimestamp () {
        return null
    }

}

```

Soft deletes is a term for deleting records by updating a delete timestamp instead of removing the row from the database.In other words, soft deletes are safe deletes, where you never lose data from your SQL tables. 

Soft deletes are disabled by default and to enable them, you must return an SQL table field name from `deleteTimestamp` method.

### dateFormat

Date format specifies the format of date in which timestamps should be saved. Internally models will convert dates to [momentJs](http://momentjs.com/) instance. You can define any valid date format supported by momentJs.

```javascript
class User extends Lucid {

    static get dateFormat () {
        return 'YYYY-MM-DD HH:mm:ss'
    }

}
```

## CRUD

Crud is a term used for Create, Read, Update and Delete records from a database table. Lucid models offer a handful of convenient methods to make this process easier.

### Defining models

You store your models inside `app/Model` directory of your application. To organise large projects you can also create subdirectories inside this directory.

Let's perform CRUD operations on a Post model which has an associated table called `posts`.

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


### Post Model

You can create `Post.js` file manually or use `ace` command to generate this file for you.

```
./ace make:model Post
```

```javascript
const Lucid = use('Lucid')

class Post extends Lucid {
}
```

### create

```javascript
const post = new Post()
post.title = 'Adonis 101'
post.body  = 'Adonis 101 is an introductory guide for beginners.'

yield post.save() // SQL INSERT
```

`save` method will persist the newly create record inside the database and will perform the following query.

```sql
insert into "posts" ("title", "body", "created_at", "updated_at") values ('Adonis 101', 'Adonis 101 is an introductory guide for beginners.', '2016-02-20 13:30:13', '2016-02-20 13:30:13')
```

### read

Reading is an operation divided into two segments. First you want to query the posts and second is to read a single post. There are specific methods to achieve the desired results, but for now, we will focus on `findBy` method.

`findyBy` is a dynamic method used with an identifier and will return the first matching result as a model instance for a given where clause.

```javascript
const post = yield Post.findBy('title','Adonis 101')
return post.toJSON()
```

Above method will perform following SQL query.
```sql
select * from "posts" where "title" = 'Adonis 101' limit 1
```

### update

The update operation is performed on an existing model instance. In general scenarios, you will have an id of a row that you want to update.

```javascript
const post = yield Post.findBy('id', 1)
post.body = 'Adding some new content'

yield post.save() // SQL UPDATE
```

`.save` method is smart enough to find out whether to create a new record or to update the existing one and in this scenario it will perform following SQL query.

```sql
update "posts" set "body" = 'Adding some new content', "updated_at" = '2016-02-20 13:54:46' where "id" = 1
```

### delete

Delete operation is also performed on an existing model instance. If you have turned [softDeletes](#soft-deletes) on, then rows will not be deleted from SQL. However, the model instance will be considered deleted.

```
const post = yield Post.findBy('id', 1)
yield post.delete()
```

Above method will perform following SQL query.
```
delete from "posts" where "id" = 1
```

Also, from this point model instance will freeze for edits, which means you can still read data from existing model instance but will not be able to edit it anymore.

```
const post = yield Post.findById(1)
yield post.delete()

console.log(post.title) // Adonis 101

post.title = 'New title' // will throw RuntimeException
```

Congratulations, you have completed your first step towards using Lucid.

## Query Methods

Lucid internally makes use of [Database]() provider, which means all methods on Database provider are available to your models. Also, there are some additional methods attached to your models for convenience.

### query()

`query` method returns an instance of Database provider, which means you build your queries with the same ease as would do with Database provider.

```javascript
yield Post.query().where('title', 'Adonis 101').fetch()
```

Above method will output following SQL query.

```sql
select * from "posts" where "title" = 'Adonis 101'
```

### fetch()

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
        original: {...}
        }
    ]
```

Later one is an array of model instances, which has its benefits. We will talk about them in a different guide.

### first()

`first` is similar to fetch but it will always return the first matched result as a model instance.

```javascript
const post = yield Post.query().where('title', 'Adonis 101').first()
```

And above query will return a model instance if more than 1 row is found in the database. Otherwise, it will return `null`.

### findBy()

`findBy` is a dynamic method used in conjunction with an attribute, for previously defined Post model we can do following.

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

### find

`find` is similar to `findBy` but works little different. findBy is a dynamic method which works with any table attribute, whereas `find` only works with the primary key of the table. For example:

```javascript
yield Post.find(1)
```

is equivalent to 

```javascript
yield Post.findBy('id', 1)
```

**Note** - It works with the primary key, not the id, which means if the primary key of the table is something else instead of `id`, it will use that.

```javascript
class Post extends Lucid {

    static get primaryKey () {
        return 'postId'
    }

}

yield Post.find(1)
```

Above method will output following SQL query.

```
select * from "posts" where "postId" = 1 limit 1
```


### findOrFail()

`findOrFail` is similar to find but will throw a `ModelNotFoundException` if no records are found for a given primaryKey.

It can become handy if you want to handle errors instead of doing manually check on whether the query has any values or not.

```javascript
try {
  yield Post.findOrFail(1)
} catch (e) {
  response.send('Unable to find post with id 1')
}
```



### pick <span>(rows)</span>

`pick` method will return first `x` rows for a given model.

```javascript
yield Post.pick(2)
```

Above query is equivalent to the following query.

```javascript
yield Post.query().orderBy('id', 'asc').limit(2).fetch()
```

You can see the difference and amount of characters you save by using `pick`.

### pickInverse

`pickInverse` works same as `pick`. Instead, the query is executed with a `DESC` clause.

```
yield Post.pickInverse(3)
```

and it will be equivalent to the following query.

```javascript
yield Post.query().orderBy('id', 'desc').limit(3).fetch()
```

### all

`all` is a shortcut method to return all rows for a given model.

```javascript
const posts = yield Post.all()
```

Above query is produce following SQL.

```sql
select * from "posts"
```


## FAQ

This section will clear some of your doubts for this guide.

1. **How model instance is different from model?**
Lucid models are ES6 classes, every static property defined in a model can be considered as settings for that model. Now when you create an instance, it always belongs to a single row of data inside your database. Now there are multiple ways of getting model instance but their purpose and result is always same.

    Also, you cannot perform bulk operations on a model instance. Which means any query whose behaviour can affect one or more rows will never be performed on a model instance. Why is it a big deal?

    It is a big deal because your getters/setters and computed properties are only executed/performed on the model instance.

2. **When to use soft deletes?**
Everyone in every situation does not require soft deletes. Think of it as a recycle bin for your database entries that you can clear once a week/month.

3. **What are collections and why do I need them?**
The best way to understand collections is to understand the effect of a query. Whenever you have a query whose result will always return a single row, it will be returned a model instance. Since it is easier to perform actions on a model instance.

    Whereas, whenever the nature of a query is not certain and is likely to return more than one database row will be wrapped inside a collection.
    
    A collection is nothing but a fancy term for lodash implicit chain and it has some advantages.
    
    * You can filter or perform any lodash methods directly, without requiring lodash. Not of a big but still little better.
    * Lucid does a lot of work behind the scenes when you call `toJSON` method on your collection. Without this method, it would not have been impossible to make Lucid.