---
title: Lucid lifecycle hooks
description: Lifecycle hooks for lucid models.
permalink: lucid-hooks
weight: 2
categories:
    - Database
versions:
    - 3.0
---

{{TOC}}

# LifeCycle Hooks

Lifecycle hooks is an another step towards keeping your applications DRY. By the end of this guide, you will know

1. How to define hooks for different events?
2. For what all reasons you can use hooks?


## Introduction

Saving/updating of data models should not become part of your application domain. For example:-

Every application requires a User model, which is likely going to have a password field, where you will encrypt password before saving the user. In your standard vanilla applications, you are more likely going to do something similar to following.

1. Inside controller, encrypt the password and save it to the database. Now you manager says "I need a command to create users from backend". You will create an `ace` command and will encrypt the password there too.

    This gives birth to **code smell**, as you are duplicating your encryption logic inside multiple files.

2. Being smart you will extract the password encryption logic in a different file, but that will give birth to another problem. Now anyone reviewing your User model will have no idea how users passwords are getting encrypted until they check one of your controllers or extracted class.

Lucid makes this entire process streamlined by introducing model hooks. Hooks are the actions you take before or after a database operation. Let's see how you can solve the password encryption problem using hooks.

```javascript
class User extends Lucid {

    static boot () {
        super.boot()
        this.addHook('beforeCreate', 'UserHook.encryptPassword')
    }

}
```

**UserHook**

```javascript
const Hash = use('Hash')
const UserHook = exports = module.exports = {}

UserHook.encryptPassword = function * (next) {
    this.password = yield Hash.make(this.password)
    yield next
}
```

It cannot become simpler than this.

## Defining Hooks

Hooks are stored inside `app/Model/Hooks` directory and are executed in sequence. To execute the next hook, you must `yield next` from the current hook. The flow is similar to HTTP middleware.

### Registering multiple hooks

Multiple hooks are registered using `defineHooks` method and are executed in the same order as they are registered.

```javascript
class User extends Lucid {
 
    static boot () {
        super.boot()
        this.defineHooks(
            'beforeCreate',
            ['UserHooks.validate', 'UserHook.encryptPassword']
        )
            
        this.defineHooks('afterCreate', 'UserHook.sendMail')
        
    }

}
```


### Adding a single hook

**beforeCreate <span>(type, [name], method)</span>**

To add a single hook, you can make of `addHook` method. Which pushes the new hook into hooks stack.

```javascript

class User extends Lucid {
    static boot () {
        this.addHook('beforeCreate', 'UserHook.encryptPassword')
    }
}

```

Each hook can get a reference to the current model instance using `this` and can perform asynchronous tasks as hooks methods are ES6 generators.

## Removing Hooks

You can also remove a hook at any time. Hooks are removed by their name. Which means while registering a hook you will have to give it a unique name.

**Registering named hook**

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
