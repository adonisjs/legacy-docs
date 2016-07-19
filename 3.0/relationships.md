---
title: Relationships
permalink: relationships
description: Database Models Relations In AdonisJs
weight: 1
categories:
- models
---

{{TOC}}

Lucid has a fluent API to work with database relations. Simple to Complex database associations are supported out of the box without any extra efforts.

## Basic Example

Relational databases are meant to define relations between two or more database tables. There are several benefits of defining relationships as they make common database operations a lot easier.

Let's take the most common scenario of a User and a Profile model. Where every user in your database can have a social profile. We call this a **one to one relationship**.

To describe this relationship, you will have to add following to your User model.

```javascript
'use strict'

const Lucid = use('Lucid')

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


## HasOne Relationship

`hasOne` relationship defines a one to one relation between 2 models using a foreign key. Foreign Key is created using the singular name of a given model followed by `_id`. However, you are free to override it.

| Model | Foreign Key |
|------ | --------|
| User | user_id |
| Seller | seller_id

![](https://i.imgsafe.org/0f13857.jpg)

In order to setup the relationship shown in the above figure, you need to define it inside your User model.

#### hasOne(relatedModel, [primaryKey=id], [foreignKey=user_id])
```javascript
class User extends Lucid {
    
    profile () {
        return this.hasOne('App/Model/Profile')
    }

}
```


## BelongsTo Relationship

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

#### belongsTo(relatedModel, [primaryKey=id], [foreignKey=user_id])
```javascript
class Profile extends Lucid {

    user () {
        return this.belongsTo('App/Model/User')
    }

}
```


## HasMany Relationship

You will find yourself using `hasMany` quite often, as this is the most common relationship required by any application. Let's review some examples.

| Model | Relation | Related Model |
| ------ | --------| -----------|
| Book   | hasMany | Chapter |
| Chapter | belongsTo | Book |
| Post | hasMany | Comment
| Comment | belongsTo | Post

`hasMany` makes it possible to have multiple related records for a given row each holding the foreignKey.

![](https://i.imgsafe.org/f942a9b.jpg)

Let's define the above Models and their relationships in Lucid

#### hasMany(relatedModel, [primaryKey=id], [foreignKey=book_id])
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


## BelongsToMany Relationship

There are situations where each side of the relationship can have many related rows inside the database. Let's see some examples

| Model | Relation | Related Model |
| ------- | --------| ------- |
| Student | belongsToMany | Courses |
| Course | belongsToMany | Students |
| Post | belongsToMany | Categories |
| Category | belongsToMany | Posts |

Taking the example of Student and Course, where both models can have many related rows in the database. In other words, it is a **many to many relationship**.

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

`belongsToMany` accepts a number of arguments to configure the table/fields for the relationship.

| Parameter | Required | Default Value |
|-----------|----------|---------------|
| pivotTable | No | Pivot table is the singular form of each model name, order by name. For example: Course and Student model will have `course_student` as the pivot table name |
| localKey | No | Reference to the model foreign key inside the pivot table.|
| otherKey | No | Reference to the related model foreign key inside the pivot table.|

## HasManyThrough Relationship

Another helpful relation type supported by Lucid is `hasManyThrough`. Where a given model is dependent on another model via 3rd model.

![](http://i.imgbox.com/Bw9ZkdNr.jpg)

Taking the example of fetching **posts** for a given **country** is not possible since there is no direct relationship between countries and posts. But with the help of `User` model, we can set up an indirect relationship between countries and posts and that is called `hasManyThrough` relationship.

```javascript
class Country extends Lucid {

    posts () {
        return this.hasManyThrough('App/Model/Post', 'App/Model/User')
    }

}
```

Now in order to fetch posts for a given country, you need to call the `posts` method on the `Country` model.

```javascript
const country = yield Country.findBy('name', 'India')
const posts = yield country.posts().fetch()
response.json(posts)
```

`hasManyThrough` accepts given options.

| Parameter | Required | Default Value |
|-----------|----------|---------------|
| relatedModel | Yes | null|
| throughModel | Yes | null|
| primaryKey | No | Model primary key |
| foreignKey | No | Model foreign key |
| throughPrimaryKey | No | Related model primary key |
| throughForeignKey | No | Related model foreign key|

## Querying Relationships

Query relationships are really simple and the most natural process with Lucid. Relationships are defined as methods on the Model class and fetched by calling those methods.

#### Lazy Loading Relationships

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
const profile = yield user.profile().fetch()
```

#### Defining Query Constraints

You can define query constraints while defining the relationships.

```javascript
class User extends Lucid {

    profile () {
        return this.hasOne('App/Model/Profile').where('is_active', true)
    }

}
```

Now when you will fetch the related profile for a given user, it will only include the record where `is_active=true`.

#### Runtime Query Constraints

You can also define runtime query constraints, just by chaining the query builder methods.

```javascript
const user = yield User.find(1)
const profile = user.profile().where('is_active', true).fetch()
```

#### Eager Loading

Lazy Loading can cause the problem of `n*1` when you want to fetch relations for multiple rows. Eager loading optimizes this process by reducing the number of **SQL** queries to two, no matter how big the results set is.

```javascript
const users = yield User.with('profile').fetch()
console.log(users.toJSON())
```

Output

```json
[
    {
        id: 1,
        username: 'joe',
        email: '...',
        profile: {
            id: 4,
            avatar: '...'
        }
    }
]
```

Also, you can eager load multiple relations by passing multiple relations keys to the `with` method.

```javascript
const user = yield User.with('profile', 'friends').fetch()
```

That's not all, `with` can also load **nested** relations.

```javascript
const user = yield User.with('friends.profile').fetch()
```

Above query will load all the friends for a given user and profile of each friend.

In order to add runtime constraints to the **eagerly loaded** results, you can make use of the `scope` method.

```javascript
const user = yield User
    .with('profile', 'friends')
    .scope('profile', function (builder) {
        builder.where('is_active', true)
    })
    .scope('friends', function(builder) {
        builder.orderBy('rank', 'desc')
    })
    .fetch()
```

#### Lazy Eager Loading

Lucid also supports eager loading on previously fetched instances.

```javascript
const user = yield User.find(1)
yield user.related('profile').load()

console.log(user.toJSON())
```

Output

```json
[
    {
        id: 1,
        username: 'joe',
        email: '...',
        profile: {
            id: 4,
            avatar: '...'
        }
    }
]
```


All conventions and concepts of eager loading are equally true with lazy-eager loading. That means you can load **multiple** and **nested** relations and can also make use of the `scope` method to add runtime query constraints.

## Insert, Updates & Deletes

Relationships can also be created, updated and deleted with ease. Each relationship type has slightly different methods to persist related data.

#### save(modelInstance)

`save` method can be used to create/update related model instance. It works with following relations.

1. hasOne
2. hasMany
3. belongsToMany

```javascript
const user = yield User.find(1)
const profile = new Profile()
profile.name = '@cybernox'
profile.avatar =  '...'

yield user.profile().save(profile)
```

Above call to `save` method will automatically set the foreign key for the saved profile.

#### create(values)

`create` works the same way as `save`, but here you can pass an arbitrary object instead of passing an instance.

```javascript
const user = yield User.find(1)
yield user.profile().create({name: '@cybernox', avatar: '...'})
```


#### saveMany(arrayOfInstances)

Save multiple related records for a given model instance. `saveMany` works with following relation types.

1. hasMany
2. belongsToMany

```javascript
const user = yield User.find(1)

const profile = new Profile({name: '@cybernox'})
const anotherProfile = new Profile({name: '@jgwhite'})

yield user.profile.saveMany([profile, anotherProfile])
```

#### createMany(arrayOfValues)

`createMany` can also create multiple records for a given model instance, but this time, you can pass an array of objects, instead of instances.

```javascript
const user = yield User.find(1)
const profiles = yield user
    .profile()
    .createMany([{name: '@cybernox'}, {name: 'jgwhite'}])
```

#### attach(rows, [pivotValues])

`attach` only works with **belongsToMany** relationship. You can attach existing records to form a relationship.

```javascript
const student = yield Student.find(1)
const coursesIds = yield Courses.ids()

yield Student.courses().attach(coursesIds)
```

Also, you can pass an object to populate fields inside the **pivotTable**.

```javascript
yield Student.courses().attach(coursesIds, {enrollment_confirmed: false})
```

Or you can also define different pivotValues for each related row.

```javascript
const mathsId = yield Courses
    .query()
    .where('name', 'Maths')
    .pluckId()

const englishId = yield Courses
    .query()
    .where('name', 'English')
    .pluckId()

const enrollment = {}
enrollment[mathsId] = {enrollment_confirmed: true}
enrollment[englishId] = {enrollment_confirmed: false}

yield Student.courses().attach(enrollment)
```

#### detach(rows)

`detach` is the opposite of `attach` and will remove the relationships from **pivotTable**.

<div class="note"><strong> Note: </strong> <code> detach </code> does not remove any existing rows, it will only remove the relationship from the pivot table. </div>

```javascript
const student = yield Student.find(1)
const coursesIds = yield Courses.ids()

yield Student.courses().detach(coursesIds)
```

#### sync(rows, [pivotValues])

`sync` will remove all existing relations and will only add given relations. Think of it as calling `detach` and `attach` one after the other.

```javascript
const student = yield Student.find(1)
const coursesIds = yield Courses.ids()

yield Student.courses().sync(coursesIds)
```

`sync` also accepts **pivotValues** similar to the `attach` method.

#### associate(modelInstance)

`associate` is used with `belongsTo` relationship to associate an existing database row.

```javascript
const user = yield User.find(1)
const profile = new Profile()
profile.name = '@cybernox'

profile.user().associate(user)
yield profile.save()
```

#### dissociate

`dissociate` is the opposite of `associate` and will remove the existing relationship

```javascript
const profile = yield Profile.find(1)

profile.user().dissociate()
yield profile.save()
```
