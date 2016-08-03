---
title: Events
permalink: events
description: Event emitter for AdonisJs
weight: 3
categories:
- providers
---

{{TOC}}

AdonisJs has a got a beautiful [Event Emitter](https://nodejs.org/docs/latest-v5.x/api/events.html) with the support for Es6 generators, wildcards and a dedicated directory for Event listeners.

Events are defined inside `bootstrap/events.js`, just like the way you define your **routes**. Listeners can respond to one or multiple events.

## Basic Example

Let's drive through the process of firing an event on user registration and sending a welcome email.

##### bootstrap/events.js

```javascript
const Event = use('Event')

Event.when('user.registers', 'Mailer.sendWelcomeEmail')
```

Above we define an event and attached a `Mailer` listener to it. Every time this event will be fired, the given listener method will be called automatically by AdonisJs.

Next step is to create the Listener and `sendWelcomeEmail` method on it. Let's use `ace` for the task.

```bash
./ace make:listener Mailer --method=sendWelcomeEmail
# on windows
ace make:listener Mailer --method=sendWelcomeEmail
```

Output

```bash
create: app/Listeners/Mailer.js
```

##### app/Listeners/Mailer.js
```javascript
'use strict'

const Mail = use('Mail')

const Mailer = exports = module.exports = {}

Mailer.sendWelcomeEmail = function * (user) {
  yield Mail.send('emails.welcome', user, function (message) {
    message.from('you@yourcompany.com')
    message.to(user.name, user.email)
    message.subject('Welcome to WonderLand')
  })
}
```

Here we make use of [Mail Provider](mail) to send an email to a given user. Make sure to check `Mail` docs to ensure you have set it up properly.

Finally, we are going to setup a controller which will fire this event upon user registration.

##### app/Http/Controllers/UserController.js
```javascript

const User = use('App/Model/User')
const Event = use('Event')

class UserController {
    
    * register (request, response) {
        const userDetails = request.only('name', 'email', 'password')
        
        const user = yield User.create(userDetails)
        if (user) {
            Event.fire('user.registers', user)
            response.send('Your account has been created')
            return
        }
        response.send('Sorry, something went wrong')
        
    }

}
```

Once the user has been created, we fire the event and pass it the user instance. Once the event will be fired, it will invoke the listener and listener will send the email.

## Config

AdonisJs application contains a config file `config/event.js` with straightforward configuration options. Under the hood, AdonisJs makes use of [Event Emitter 2](https://github.com/asyncly/EventEmitter2) and implements all the available configuration options.

## Event Methods

Below is the list of available methods exposed by the Event provider.

#### when(event, [name], listener)

Register a listener for a given event. You can also define an optional **name** for a listener, which can be used to remove it later.

```javascript
Event.when('user.registers', 'Mail.sendWelcomeEmail')
```

```javascript
Event.when('user.registers', function * () {
    // As a closure
})
```

```javascript
Event.when('user.registers', 'registration', 'Mail.sendWelcomeEmail')
```

You can also make use of `listen` and `on`, which are aliases to the `when` method.

#### once(event, handler)

`once` works same as `when` but is executed only for one time.

```javascript
Event.once('app.boot', function * () {
    // Do something
})
```

#### any(handler)

`any` will attach a global event listener, which can listen to all the events.

```javascript
Event.any(function (event) {
    console.log(event)
})
```

#### times(number)

Set a limit for times an event listener will be executed and will be removed after that.

```javascript
Event.times(4).when('user.registers', function () {
    // I will be executed 4 times only
})
```

#### fire(event, data)

Fires an event. You can also make use of `emit`, which is an alias to `fire`.

```javascript
Event.fire('user.registers', user)
```

#### removeListeners([event])

Remove all listeners from a given event or for all events.

```javascript
Event.removeListeners() // will remove all listeners

Event.removeListeners('user.registers') // will remove listeners for user.registers event only
```

#### removeListener(event, name)

Remove a named listener for a given event.

```javascript
// register multiple
Event.when('user.registers', 'Logger.log')
Event.when('user.registers', 'registration', 'Mail.sendWelcomeEmail')

// remove a specific one
Event.removeListener('user.registers', 'registration')
```

#### hasListeners(event)

Returns a **boolean** whether an event has listeners or not.

```javascript
Event.hasListeners('user.registers')
```

#### getListeners(event)

Returns an array of listeners for a specific event.

```javascript
Event.getListeners('user.registers')
```

## Emitter Instance

All of your listeners can access the `emitter` instance.

```javascript
Event.when('user.registers', function () {
    console.log(this.emitter)
})
```