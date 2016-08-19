---
title: Sessions
permalink: sessions
description: Creating and reading values from session store.
categories:
- general-topics
---

{{TOC}}

AdonisJs has out of the box support for session management via **cookies** and **flat files** saved on the server. Also you can create sessions for a single request known as Flash messages.

## Basic Example

```javascript
Route.get('/cart', function * (request, response) {
	const cartItems = yield request.session.get('cartItems')
	yield response.sendView('cart', {cartItems})
})
```


## Drivers

AdonisJs ships with `cookie` and a `file` driver, which can be configured inside `config/session.js` file.

## Methods

All of the session methods are available on the `request` object.


#### put(key, value)

Add a value to the session store.

```javascript
Route.get('/user', function * (request, response) {
  yield request.session.put('username', 'doe')
  // or
  yield request.session.put({username: 'doe'})
})
```

#### get(key, [defaultValue])

Returns the session value for a given key.

```javascript
Route.get('/user', function * (request, response) {
  const username = yield request.session.get('username')
  // or
  const userId = yield request.session.get('userId', 123)
})
```

#### all

Returns all session values as an object

```javascript
const sessionValues = yield request.session.all()
```

#### forget(key)

Remove value for a given key

```javascript
yield request.session.forget('name')
```

#### pull(key, [defaultValue])

Pulls and removes the value for a given key. Think of it as calling `get` and `forget` together.

```javascript
const username = yield request.session.pull('username')
```

## Flash Messages

In order to make use of flash messages, make sure to enable the `Flash` middleware by adding the below line to the list of global middleware.

**app/Http/kernel.js**

```javascript
const globalMiddleware = [
  ...,
  'Adonis/Middleware/Flash'
]
```

Flash messages are extremely useful when you want to send form inputs or errors back on form submission. Let's take the example of user signup.

##### app/Http/Controllers/UserController

```javascript
class UserContoller {

  * signup (request, response) {
    const validation = yield Validator.validate(rules, request.all())
    if (validation.fails()) {
      yield request
	      .withAll()
	      .andWith({errors: validation.messages()})
	      .flash()
      response.redirect('back')
    }
  }

}
```

`withAll` will flash all the values submitted by the form back to the signup page. So you can set them back to the form fields, instead of asking the end-user to re-type everything.

`andWith` is method to attach a custom object to the flash messages, here we are sending back the validation errors.

```twig

{% for error in old('errors') %}
	<li> {{ error.message }} </li>
{% endfor %}

{{ form.open({method: 'UserController.signup'}) }}

  {{ form.text('email', old('email')) }}
  {{ form.password('password', old('password')) }}

  {{ form.submit('Create Account') }}

{{ form.close() }}
```

Below is the list of methods to set flash values.

#### withAll

Will flash everything from `request.all()`

```javascript
yield request.withAll().flash()
```

#### withOnly(keys...)

Flash values only for defined keys.

```javascript
yield request.withOnly('email').flash()
```

#### withOut(keys...)

Flash all except defined keys.

```javascript
yield request.withOut('password').flash()
```

#### with(values)

Flash a custom object.

```javascript
yield request.with({error: 'Please fill in all details'}).flash()
```

#### andWith(values)

Chainable method to send custom object with request data.

```javascript
yield request
  .withAll()
  .andWith({error: 'Please fill in all details'})
  .flash()
```

## Access Flash Values

You can get access to flash values inside your views using the `old()` helper.

```twig
{{ old('username') }}
{# or #}
{{ old('profile.username') }}
```

Or you can make use of `flashMessages` global to fetch all values.

```twig
{% for key, message in flashMessages %}
  {{ message }}
{% endfor %}
```
