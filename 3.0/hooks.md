---
title: Hooks
description: Lifecycle hooks for lucid models.
permalink: lucid-hooks
weight: 4
categories:
- Database
---

Hooks are the actions you take before or after a certain database operation. All of your database hooks are stored inside the `app/Model/Hooks` directory.

There are plenty of use-cases for using Databases Hooks, and one of them is encrypting password before saving it to the database.

## Basic Example

Let's start by creating a hook for encrypting a password. We are going to make use of an `ace` command as always.

```bash
./ace make:hook User --method=encryptPassword
# on windows
ace make:hook User --method=encryptPassword
```

Above will output

```bash
create: app/Model/Hooks/User.js
```

##### app/Model/Hooks/User.js

```javascript
const Hash = use('Hash')
const User = exports = module.exports = {}

User.encryptPassword = function * (next) {
    this.password = yield Hash.make(this.password)
    yield next
}
```

Next you need to register the above method on your `User` model.

##### app/Model/User.js
```javascript
class User extends Lucid {

  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'User.encryptPassword')
  }

}
```

`boot` method is called automatically once for every model. So this is best place to register a hook.

## Defining Hooks

Hooks are executed in the sequence they are registered. To execute the next hook, you must `yield next` from the current hook as you do within the HTTP Middleware.

#### addHook(event, [name], action)

```javascript
static boot () {
  super.boot()
  this.addHook('beforeCreate', 'User.encryptPassword')
}
```

Also you can create **named hooks** by giving them a unique name. Named hooks are helpful when you want to remove them at later stage.

```javascript
static boot () {
  super.boot()
  this.addHook('beforeCreate', 'encryptingPassword', 'User.encryptPassword')
}
```

#### defineHooks(event, arrayOfActions)

Multiple hooks are registered using `defineHooks` method and are executed in the same order as they are registered.

```javascript
class User extends Lucid {
 
  static boot () {
    super.boot()
    this.defineHooks('beforeCreate', 'UserHooks.validate', 'UserHook.encryptPassword')        
  }

}
```

Each hook will get a reference to the current model instance using `this` and can perform asynchronous tasks as hooks methods are ES2015 generators.

## Removing Hooks

You can also remove a hook at any time. Hooks are removed by their name. Which means while registering a hook you will have to give it a unique name.

```javascript
this.addHook('beforeCreate', 'validation', 'UserHook.validate')
```

To remove a hook you say

```javascript
User.removeHook('validation')
```


## Aborting database operation

Hooks can abort database operations by throwing exceptions. After an exception is thrown all future operations will be canceled.

```
UserHook.validate = function * (next) {
    if (!validated) {
      throw new Error('Validation failed')
    }
    yield next
}
```

## List Of Hooks

Below is the list of hooks you can register for a given model. Registering Hooks is a one time process, so consider registering them inside `static boot` method of your model.

- beforeCreate
- afterCreate
- beforeUpdate
- afterUpdate
- beforeDelete
- afterDelete
- beforeRestore ( only with soft deletes )
- afterRestore ( only with soft deletes )
