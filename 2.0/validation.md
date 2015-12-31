# Validation

Validating inputs is the most important and required feature for any application. Adonis has a beautiful yet powerful validation provider. Under the hood, it makes use of [Indicative](http://indicative.adonisjs.com/) but makes it easier to catch errors without using try/catch blocks.

- [Installing](#installing)
- [Basic Usage](#basic-usage)
- [Custom Messages](#custom-messages)
- [Available Rules](#available-rules)
- [Raw Validations](#raw-validations)
- [Extending](#extending)

## Installing

```bash,line-numbers
npm install --save adonis-validation-provider
```

Now in order to make use of Validation provider you need to register it inside `bootstrap/app.js` file.

```javascript,line-numbers
const providers = [
  'adonis-validation-provider/providers/Validator'
]
```

Also consider adding a alias to validation provider.

```javascript,line-numbers
const aliases = {
  Validator: 'Adonis/Addons/Validator'
}
```

## Basic Usage
For the most basic validation, you need to define rules and same can be done in your Lucid models, or you can have a dedicated service for defining validation rules.

```javascript,line-numbers
const Validator = use('Validator')

class UserController {

  *store (request, response) {

    // defining rules
    const rules = {
      username : 'required',
      email    : 'required|email',
      password : 'required|min:6'
    }

    // fetching request data
    const data = request.all()

    const validation = yield Validator.validate(rules, data)

    // checking if validation has failed
    if (validation.fails()) {
      return validation.messages()
    }
    // Validation successful, go ahead
  }
}
```

## Custom Messages
`validate` method accepts a 3rd argument to print custom messages when validation fails, as the system generated messages are not helpful for humans.

Read moe about custom messages at [Indicative Custom Messages](http://indicative.adonisjs.com/docs/2.0/basics#custom-messages)

## Available Rules
All rules defined by Indicative are available to Validation provider. Documentation on rules is available at [Indicative schema rules](http://indicative.adonisjs.com/docs/2.0/schema-rules#rules)

## Raw Validations
Indicative [raw validations](http://indicative.adonisjs.com/docs/2.0/raw) are available as :-

```javascript,line-numbers
const Validator = use('Validator')
Validator.is.array([22, 18])
```

## Extending

As every application has different nature, you may want to extend the validator to add your own rules. Same can be done using the below example. Also read more about [extending indicative](http://indicative.adonisjs.com/docs/2.0/extending)

```javascript,line-numbers
var phoneNumber = function(data, field, message, args, get){
  return new Promise(function(resolve,reject){
    // grabbing field value from data object
    const fieldValue = get(data, field)

    if (!fieldValue) {
      return resolve('validation skipped')
    }

    // regex to validate phone number
    const regex    = /^(()?\d{3}())?(-|\s)?\d{3}(-|\s)?\d{4}$/;

    if (!phone_no || regex.test(phone_no)) {
      resolve('Validated successfully')
      return
    }
    reject(message)
  });
};

Validator.extend('phoneNo',phoneNumber,'Enter valid phone number')
```
