---
title: Lucid model relationships
description: Relationships for Lucid models.
permalink: lucid-relationships
weight: 3
categories:
    - Database
---

{{TOC}}

# RelationShips

This guide covers the model relationships in Lucid. By the end of this guide, you will know

1. What are model relations?
2. How to define relationships between two or more models.
3. How to Eager/Lazy load relationships.
4. How to fetch nested relations.

## Introduction

Relational databases are meant to define relations between two or more database tables. There are several benefits of defining relationships as they make common database operations a lot easier.

Let's take the most common scenario of a User and Profile model. Where every user in your database can have a social profile. We call this as one to one relation.

To describe this relationship, you will have to add following to your User model.

```javascript
class User extends Lucid {

    profile () {
        return this.hasOne('App/Model/Profile')
    }

}
```

And now you can access profile for a given user by calling the `profile` method.

```javascript
const user = yield User.find(1)
const userProfile = yield user.profile().fetch()
```

## Types Of Relationships

### hasOne

`hasOne` relationship defines a one to one relation between 2 models using a foreign key. Foreign Key is created using the singular name of a given model followed by `_id`. However, you are free to override it.

| Model | Foreign Key |
|------ | --------|
| User | user_id |
| Seller | seller_id

![](https://i.imgsafe.org/0f13857.jpg)

In order to setup the relationship shown in the above figure, you need to define it inside your User model.

```javascript
class User extends Lucid {
    
    profile () {
        return this.hasOne('App/Model/Profile', 'primaryKey', 'foreignKey')
    }

}
```

<--- NEEDS RECHECK --> Let's use our Profile and User models to check out different ways of interacting with `hasOne` relation.

### belongsTo

`belongsTo` is the opposite of `hasOne` and always holds the foreign key. So the best way to remember it is with the foreignKey. Any database table that has the foreign key, it's Model will always have the `belongsTo` relation.

There are no hard rules on how to design your relationships, but it is always nice to design them in the most natural way.

For example:

| Model | Relation | Related Model
| ------ | --------| -------------
| User | hasOne | Profile
| Profile | belongsTo | User
| Student | hasOne | IdCard
| IdCard | belongsTo | User

Hope this makes sense. Continuing with our `User` `Profile` relationship, the Profile model will contain the `belongsTo` relation as it holds the foreignKey.

```javascript
class Profile extends Lucid {

    user () {
        return this.belongsTo('App/Model/User', 'primaryKey', 'foreignKey')
    }

}
```


### hasMany

You will find yourself using `hasMany` quite often, as this is the most common relationship required by any application. Let's review some examples.

| Model | Relation | Related Model |
| ------ | --------| -----------|
| Book   | hasMany | Chapter |
| Chapter | belongsTo | Book |
| Post | hasMany | Comment
| Comment | belongsTo | Post

`hasMany` makes it possible to have multiple related records in a different table, each holding the foreignKey, and if you remember, the model holding the foreign key always have `belongsTo` relationship.

![](https://i.imgsafe.org/f942a9b.jpg)

Let's define the above Models and their relationships in Lucid

```javascript
class Book extends Lucid {
    
    chapters () {
        return this.hasMany('App/Model/Chapter')    
    }

}
```

```javascript
class Chapter extends Lucid {
    
    book () {
        return this.belongsTo('App/Model/Book')    
    }

}
```


### belongsToMany

There are situations where each side of the relationship can have many rows inside the database. Let's see some examples

| Model | Relation | Related Model |
| ------- | --------| ------- |
| Student | belongsToMany | Courses |
| Course | belongsToMany | Students |
| Post | belongsToMany | Categories |
| Category | belongsToMany | Posts |

Taking the example of Student and Course, where both models can have many related rows in the database. In other words, it is a many to many relationship. 

![](https://i.imgsafe.org/d107fc7.jpg)

Looking at the above figure, you will notice, there is a 3rd table called `course_student`. Since each model on both the ends has many relationships, they themselves cannot hold the foreign key.

The third table is known as a `pivot table`. It holds the Foreign Key for both Models and defines a unique relationship between them.

Let's define this relationship in Lucid and review configurable options.

```javascript
class Student extends Lucid {

    courses () {
        return this.belongsToMany('App/Model/Course')
    }

}
```

```javascript
class Course extends Lucid {
    
    students () {
        return this.belongsToMany('App/Model/Student')
    }

}
```

`belongsToMany` accepts number of arguments to configure the table/fields for the relationship.

**pivotTable**

A pivot table is the singular form of each model name, order by name. For example:

Course and Student model will have `course_student` as the pivot table name.You can override it by passing a custom table to the relation definition.

```
this.belongsToMany('Model', 'pivotTable')
```

**localKey**

Local key is the reference to the model foreign key inside the pivot table.

```
this.belongsToMany('Model', 'pivotTable', 'localKey')
```

**otherKey**

Another key is the reference to the related model foreign key inside the pivot table.

```
this.belongsToMany('Model', 'pivotTable', 'localKey', 'otherKey')
```

## Retrieving Relationships

Relationships are fetched by calling the relation method on a given model. 

```javascript
class User extends Lucid {
	
	profile () {
		return this.hasOne('App/Model/Profile')
	}

}
```

Now in order to fetch the profile for a given user, you can call the `profile` method on the user model instance.

```javascript
const user = yield User.find(1)
const profile = user.profile().fetch()
```

### Adding Query Constraints

You can make use of any query builder methods while fetching related models.

```javascript
const profile = user.profile().where('is_active', true).fetch()
```

### Eager Loading

So far what you have seen is called Lazy Loading, where relationships are resolved for each model instance and this arises the problem of `n*1` when trying to load relations for multiple rows.

### What is Lazy Loading?

Let's imagine you want to load profiles for all the users and using the lazy loading approach, you will do something like this.

```javascript
const cf = require('co-functional')
const users = yield User.all()

cf.each(function * (user) {
	const profile = yield user.profile().fetch()
}, users)
```

What's happening here is, we are making a query to the profiles table for each user.Which means if there are 100 users, we will make 100 queries to profiles table + 1 query to the users table.

It's a NO NO. Let's review Eager loading now.

### with

Eager loading makes this process better by loading all the given profiles for all users in total of 2 queries.

```javascript
const users = yield User.query().with('profile').fetch()

console.log(users.toJSON())
```

`with` method will load the given relation by making a join query and returns it back as a nested property.

Also you can load multiple and nested relations using `with` method.

### Multiple relations

```javascript
const users = yield User.query().with('profile', 'friends').fetch()
```

### Nested relations

```javascript
const users = yield User.query().with('friends.profile').fetch()
```

## Lazy Eager Loading

You can also eager load relations for a given model instance.

```javascript
const student = yield Student.find(1)
yield student.related('courses').load()

console.log(student.get('courses'))
```