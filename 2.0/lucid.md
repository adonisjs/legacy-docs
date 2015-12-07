# Lucid

Lucid is an implementation of ActiveRecord for working with your database. Each table has a data model stored inside `app/Model` making it super easy for you to interact with SQL databases.

<p>&nbsp;</p>

- [Setup](#setup)
- [Defining Models](#defining-models)
  - [Table name](#table-name)
  - [Primary keys](#primary-keys)
  - [Timestamps](#timestamps)
  - [Soft Deletes](#soft-deletes)
  - [Visible](#visible)
  - [Hidden](#hidden)
- [Making Queries](#making-queries)
- [Model Instances](#model-instances)
- [Deletes](#deletes)
  - [Soft Delete](#soft-delete)
  - [Force Delete](#force-delete)

<p>&nbsp;</p>

## Setup

Make sure to follow setup steps defined in [Connection setup](/connection#setup) to make use of `Lucid`.

## Defining Models

You start by creating files inside `app/Model` directory and try to keep your model names capitalized.

```javascript,line-numbers
// app/Model/User.js

const Lucid = use('Lucid')

class User extends Lucid{

}
```

Alternatively , you can make use of `ace command` to generate a model.

```bash,line-numbers
node ace make:model User
```

<p>&nbsp;</p>

That's all you need to create a data model, and now you are ready to retrieve data from it.

```javascript,line-numbers
// app/Http/Controllers/UserController.js

const User = use('App/Model/User')

class UserController{

  *index (request, response) {
    const users = yield User.all()
    response.json(users)
  }

}
```

<p>&nbsp;</p>

### Table name
Lucid makes table name for a given model out of conventions, so a model called `User` will have `users` table by default. That may not be true in every case.
To override any property over model, you can define a static method.

```javascript,line-numbers
// app/Model/User.js

class User extends Lucid{

  static get table(){
    return 'my_users'
  }

}
```

<p>&nbsp;</p>

### Primary keys
By default `id` is set as primary key for a given model, which can be overridden using

```javascript,line-numbers
class User extends Lucid{

  static get primaryKey(){
    return 'user_id'
  }

}
```

<p>&nbsp;</p>

### Timestamps
Lucid itself sets `created_at` and `updated_at` timestamps while creating and updating data models. You can toggle the behavior using `timestamps` getter.

```javascript,line-numbers
class User extends Lucid{

  static get timestamps(){
    return false;
  }

}
```

<p>&nbsp;</p>

### Soft Deletes
Soft deletes are enabled by default, means your delete queries do not delete rows permanently, instead `deleted_at` timestamp is updated on rows to treat them as deleted.

```javascript,line-numbers
class User extends Lucid{

  static get softDeletes(){
    return 'deleted_at'
  }

  // to disable softDeletes
  static get softDeletes(){
    return false
  }

}
```

<p>&nbsp;</p>

### Visible
You can define the visibility of your fields when fetching data using models, it is helpful when you want to omit some fields from query results.

```javascript,line-numbers
class User extends Lucid{

  static get visible(){
    return ['username','email','age']
  }

}
```

<p>&nbsp;</p>

### Hidden
Hidden is the opposite of visible and can become a better choice when you want to hide a couple of fields, instead of defining multiple visible fields.

```javascript,line-numbers
class User extends Lucid{

  static get hidden(){
    return ['password']
  }

}
```


<p>&nbsp;</p>
<p>&nbsp;</p>

## Making Queries
You can make use of any method provided by `Database` provider on your models, but also Lucid adds more vocabulary to query builder.

<p>&nbsp;</p>

### all
All will make a `select *` query to a model table and will return an instance of Collection containing response data.

```javascript,line-numbers
yield User.all()
```

#### filtering data
```javascript,line-numbers
const users = yield User.all()
const adults = users.filter(function (user) {
  return user.age > 18
}).value()
```

#### fetching JSON
To get the JSON object, you need to use `toJSON` method on your collections.

```javascript,line-numbers
const users = yield User.all()

if(users.size()){
  return users.toJSON()
}
```

<p>&nbsp;</p>

### create

```javascript,line-numbers
yield User.create({username:'foo',age:22})
```

<p>&nbsp;</p>

### withTrashed
By default query builder will not fetch `soft deleted` rows, but in scenarios where you want them, you can make use of `withTrashed` method.

```javascript,line-numbers
yield User.withTrashed().fetch()
```

<p>&nbsp;</p>

### fetch
Make sure always to call fetch method when you want to execute your query chain.

```javascript,line-numbers
yield User.where('age','>',18).fetch()
```

<p>&nbsp;</p>
<p>&nbsp;</p>

## Model Instances
By default, you fetch data using static methods defined on your models. Model instances belong to a single row and makes it easier to create, update and remove database rows.


### create
```javascript,line-numbers
// making new instance of User model
const user = new User

// setting up user attributes
user.username = 'foo'
user.age = 22

// creating user
yield user.create()

```

<p>&nbsp;</p>

### update
```javascript,line-numbers

// Fetching user with its primary key
const user = yield User.find(1)

// updating email address
user.email = 'new_email_address'

// updating new email address
yield user.update()
```

<p>&nbsp;</p>

### delete

```javascript,line-numbers

// Fetching user with its primary key
const user = yield User.find(1)

// for soft delete
yield user.delete()

// for permanent delete
yield user.forceDelete()
```

<p>&nbsp;</p>
<p>&nbsp;</p>

## Deletes
Deleting data models is a special activity with Lucid. Since it supports soft deletes out of the box, it also exposes some helpful methods around deleting rows.


### Soft Delete
By default, every delete action is a soft delete **(if enabled)**.

```javascript,line-numbers
const user = yield User.find(1)
yield user.delete()
```

<p>&nbsp;</p>

### isTrashed
`find` method returns soft deleted row from database, but also provides you a handy method to check whether model instance is soft deleted or not

```javascript,line-numbers
const user = yield User.find(1)

if(user.isTrashed()){

  // do something

}
```

<p>&nbsp;</p>

### Force Delete
In the case when you want to delete model instance permanently, you can make use of `forceDelete` method.

```javascript,line-numbers
const user = yield User.find(1)
yield user.forceDelete()
```
