---
title: Validation
permalink: validator
description: Form And Data Validations In AdonisJs
weight: 8
categories:
- providers
---

{{TOC}}

Validating user data is a key requirement for any application. AdonisJs makes use of [Indicative](http://indicative.adonisjs.com/) to sanitize and validate user inputs. It supports all validation rules from indicative, so make sure to check indicative's documentation.

## Setup

Validator is not the part of the base installation and hence you are required to install and register it manually.

```bash
npm i --save adonis-validation-provider
```

Next, you need to register the provider to the providers list in your `bootstrap/app.js` file.

##### bootstrap/app.js
```javascript
const providers = [
    ....,
    'adonis-validation-provider/providers/ValidatorProvider'
]
```

Also, make sure to register an alias, which is a short name for the provider namespace.

```javascript
const aliases = {
    Validator: 'Adonis/Addons/Validator'
}
```

## Basic Example

Let's take the most basic example of validating a form to create a user. For now, we will perform all the validations within the controller, but you are free to organize them into separate services.

Let's start by defining the rules on the User model. Make sure to also check out indicative docs on [schema rules](http://indicative.adonisjs.com/#indicative-schema-rules).

##### app/Model/User.js

```javascript
const Lucid = use('Lucid')

class User extends Lucid {

    static get rules () {
        return {
            username: 'required|unique:users',
            email: 'required|email|unique:users',
            password: 'required|confirmed',
        }        
    }

}
```

##### app/Http/Controllers/UserController.js

```javascript
const Validator = use('Validator')
const User = use('App/Model/User')

class UserController {

    * store(request, response) {
        const userData = request.all()
        const validation = yield Validator.validate(userData, User.rules)
        
        if (validation.fails()) {
            response.json(validation.messages())
            return
        }
        
        // Validation passed, create the user.        
    }

}
```

We start by defining the validation `rules` on the **User Model** and then make use of the `Validator` to validate the request data. If validation fails, we will send the errors to the browser.

## Indicative API

Indicative has a beautiful API for sanitizing and validating data. Make sure to check the indicative docs to see all available options. Below are the ways to access the API within AdonisJs.

#### validate(data, rules, [messages])

```javascript
const validation = yield Validator.validate(data, rules, messages)
```

#### validateAll(data, rules, [messages])

It is same as `validate` but returns all the errors instead of the first error.

```javascript
const validation = yield Validator.validateAll(data, rules, messages)
```

#### sanitize(data, rules)

```javascript
const data = request.all()
const rules = {
    email: 'normalize_email',
    bio: 'strip_links',
    fullname: 'capitalize'
}

const sanitizedData = Validator.sanitize(data, rules)
```

Also, you can define your sanitization rules on the model, the same way we defined the validation rules.

#### is

You can make use of `is` method to do inline validations instead of going through a complete validation lifecycle.

```javascript
if (Validator.is.email('foo')) {
    // do something
}
```

#### sanitizor

Same as `is`, you can do inline data sanitisation.

```javascript
const sanitizedEmail = Validator.sanitizor.normalizeEmail('bar.sneaky+foo@googlemail.com')

// returns barsneaky@gmail.com
```

Also 

```javascript
Validator.sanitizor.slug('hello world') // hello-world
```

## Extending Validator

You can also extend Validator to add your own rules. The `extend` API is same as the [Indicative's API](http://indicative.adonisjs.com/#indicative-extending).

The best time to extend the Validator is when the app get's booted. AdonisJs HTTP server emits a start event and its listener can be used to extend the Validator.

We will start by creating a Service to extend the Validator and require that service inside the Listener. This way our extended methods will be attached to the Validator at the boot time.

##### app/Services/Validator.js

```javascript
const Validator = use('Validator')

Validator.extend('adult', (data, field, message, args, get) => {
        
    return new Promise( (resolve, reject) => {
        
        const fieldValue = get(data, field)
        if (fieldValue > 18) {
            resolve('Allowed')
            return
        }
        
        reject(message)
    })    
    
}, 'You must be an adult')
```

<div class="note">
    <strong> Note: </strong> Above method is just a dummy implementation. Make sure to handle all use cases regarding your custom rule.
</div>

##### app/Listeners/Http.js

```javascript
Http.onStart = function () {
    use('App/Services/Validator')
}
```

Now you can make use of the `adult` rule just like any other rule inside your application.
