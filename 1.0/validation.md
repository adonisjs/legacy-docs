{% raw %}

# Validation

Validating inputs is the most important and required feature for any application. Adonis ships a beautiful yet powerful validation provider out of the box. Under the hood, it makes use of [Indicative][indicative] but makes it easier to catch errors without using `try/catch` blocks.



- [Basic Validation](#basic-validation)
- [Custom Messages](#custom-messages)
  - [Global Messages](#global-messages)
  - [Field Specific Messages](#field-specific-messages)
  - [Templates](#templates)
- [Available Rules](#available-rules)
- [Extending](#extending)



## Basic Validation

For the most basic validation, you need to define rules and same can be done with your data models, or maybe you can define a dedicated service for defining validation rules.

```javascript,line-numbers
const Validator = use('Validator')

class UserController{

  *store (request,response) {

    // defining rules
    const rules = {
      username : 'required',
      email    : 'required|email',
      password : 'required|min:6'
    }

    // fetching request data
    const data = request.all()

    yield Validator.validate(rules,data)

    // checking if validation has failed
    if(Validator.fails()){
      return Validator.messages()
    }

    // Validation successful, go ahead

  }

}

```


## Custom Messages

`validate` method accepts a 3rd argument to print custom messages when validation fails, as the system generated messages are not helpful for humans.

```javascript,line-numbers
yield Validate.validate(rules,data,messages)
```


### Global Messages

You can define messages for validation rules as defined below

```javascript,line-numbers
const messages = {
  required: 'This field is required',
  email : 'Doesn\'t seems to be a valid email address.'
}
```

The reason we call them global messages as they will print the same message every time `required` validation will fail.


### Field Specific Messages

They are more personalized as you have the power to decide what to print for every validation failure corresponding to a given field.

```javascript,line-numbers
const messages = {
  'username.required' : 'Choose username for your account',
  'password.required' : 'Password is required to have a secure login'
}
```

Hope you can see the difference between multiple ways of defining error messages.


### Templates
Not only you can define custom messages, here you can leverage the power of templates out of the box.
The best part of templates is they replace static sections of your messages with dynamic placeholders.

```javascript,line-numbers
const messages = {
  required: '{{ field }} is required'
}
```

Now, `field` is the reference to the field name present under validation. Apart from `{{ field }}` you can use following placeholders.

- [value](#value)
- [argument](#argument)


#### value <span>(value of field under validation)</span>

```javascript,line-numbers
const messages = {
  email : '{{ value }} is not a valid email address '
}
```

#### argument <span>(Array:values defined next to rule)</span>

```javascript,line-numbers
var messages      = {
  min             : '{{ field }} should be over {{ argument.0 }} characters'
}

var rules         = {
  password        : 'min:6'
}

// above prints password should be over 6 characters

```


## Available Rules

There are bunch of rules available to be used with `Validator', Check them out here on [Indicative Rules](http://indicative.adonisjs.com/docs/arithmetic-validation-rules)


## Extending

At times you may have to extend `Validator` to add custom rules, you can do same using `extend` method.

```javascript,line-numbers
var phoneNumber = function(data, field, message, args){

  new Promise(function(resolve,reject){

    // grabbing field value from data object
     var phone_no = data[field];

     // regex to validate phone number
     var regex    = /^(()?\d{3}())?(-|\s)?\d{3}(-|\s)?\d{4}$/;

    if(!phone_no || regex.test(phone_no)){

      resolve('Validated successfully');
      return

    }
    reject(message);

  });                

};

Validator.extend('phone_no',phoneNumber,'Enter valid phone number')
```

[indicative]: http://indicative.adonisjs.com/

{% endraw %}
