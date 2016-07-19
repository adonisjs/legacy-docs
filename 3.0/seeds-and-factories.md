---
title: Seeds And Factories
permalink: seeds-and-factories
description: Seeding database with Model factories in AdonisJs
weight: 3
categories:
- database
---

{{TOC}}

As Migrations helps you in automating the process of setting up database schema. Database Seeds & Factories helps in seeding the database with dummy data. Dummy data can be used while running tests or setting up the initial state of an application.

Seeds are stored inside `database/seeds` directory and factories are created inside `database/factory.js`.

## Basic Example

You start by defining a blueprint for a given model.

##### database/factory.js
```javascript
const Factory = use('Factory')

Factory.blueprint('App/Model/User', (fake) => {

  return {
    username: fake.username(),
    email: fake.email(),
    password: fake.password(),
    firstName: fake.first(),
    lastName: fake.last()
  }

})
```

Method `blueprint` takes two required parameters.

1. The namespace of the model.
2. Closure to return an object. It get's instance of [Chance.Js](http://chancejs.com) to generate random dummy data.

Now you can use the above blueprint inside database seed files to create one or more rows inside the database table.

```bash
./ace make:seed User
```

Output

```bash
create: database/seeds/User.js
```

##### database/seeds/User.js

Finally, you can make use of `Factory` provider to insert the given number of rows inside the database table.

```javascript
'use strict'

const Factory = use('Factory')

class UserSeeder {

  * run () {
    yield Factory.model('App/Model/User').create(5)
  }

}

module.exports = UserSeeder
```

Every Database seed file needs to have `run` method which is called automatically when you run `db:seed` command.

```
./ace db:seed
```

## Model Factory Methods

Below is the list of methods available when making use of **Lucid** models to generate dummy data.

#### blueprint(namespace, callback)

```javascript
Factory.blueprint('App/Model/User', (fake) => {
    return {
        username: fake.username(),
        ...
    }
})
```


#### create([numberOfRows=1])

The number of rows to create for a given model.

```javascript
yield Factory.model('App/Model/User').create(5)
```

#### make([count=1])

`make` will return the model instance or an array of instances with fake data.

```javascript
const post = Factory.model('App/Model/Post').make()
yield User.posts().create(post)
```

#### each(callback)

`each` is a generator friendly method to loop over created instances of a model. It is helpful when you want to save relationship for every created instance.

```javascript
const users = yield Factory.model('App/Model/User').create(5)

users.each(function * (user) {
    const post = Factory.model('App/Model/Post').make()
    yield user.posts().save(post);
})
```

#### reset()

`reset` will truncate the table for a given model

```javascript
yield Factory.model('App/Model/User').reset()
```

## Database Factory Methods

Factories can also make use of [Database](database-setup) provider to interact with the database.

#### blueprint(tableName, callback)

```javascript
Factory.blueprint('users', (fake) => {
    return {
        username: fake.username(),
        ...
    }
})
```

#### create

```javascript
yield Factory.get('users').create(5)
```

#### table

Define a different database table name at runtime.

```javascript
yield Factory.get('users').table('my_users').create(5)
```

#### returning

Defining `returning` column for PostgreSQL.

```javascript
yield Factory.get('users').returning('id').create(5)
```

#### reset

Truncate database table.

```javascript
yield Factory.get('users').reset()
```

## Fake Methods

`fake` object passed to the `factory.blueprint` closure is an instance of [chance.js](http://chancejs.com/) and all methods are supported as the first-class citizen.

Also, AdonisJs extends **chance.js** to add it's own methods to it.

#### username([length=5])

Returns a random username.

```javascript
Factory.blueprint('App/Model/User', (fake) => {
    return {
        username: fake.username()
    }
})
```

#### password([length=20])

Returns a random password.

```javascript
Factory.blueprint('App/Model/User', (fake) => {
    return {
        password: fake.password()
    }
})
```
