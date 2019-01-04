---
title: Error Handling
permalink: error-handling
description: Handling runtime and thrown exceptions in AdonisJs
weight: 9
categories:
- guides
---

{{TOC}}

Handling **errors** gracefully is the key aspect of writing software. Showing `uncaught exceptions` to the world is not fun and neither helpful for programmers.

## Philosophy 

Throwing and catching exceptions has always been a task for the software industry. There are plenty of conventions and books talking about best practices and techniques for dealing with exceptions.

With AdonisJs we try to follow some simple conventions when throwing exceptions and exposes a couple of ways to catch and act upon those exceptions.

## Throwing Exceptions

All starts with throwing meaningful exceptions so that they can be handled gracefully. AdonisJs makes use of [node exceptions](https://www.npmjs.com/package/node-exceptions) an npm module to throw custom exceptions. For example:

```javascript
const NE = require('node-exceptions')
class UserNotFoundException extends NE.LogicalException {}

throw new UserNotFoundException(`Cannot find user with ${username} username`)

```

Is more readable and easy to handle in comparison to the below one.

```javascript
throw new Error(`Cannot find user with ${username} username`)
```


The first one `UserNotFoundException` is easier to handle as you can grab the exception name and show a custom error message, instead of relying on exception original text.

```javascript
try {

  const user = findUser(username)

} catch (e) {

  if(e.name === 'UserNotFoundException') {
      response.notFound(e.message)
  } else {
      response.internalServerError('Something went wrong')
  }

}
```


## Handling Exceptions

Since AdonisJs has out of the box support for `ES2015` generators, you can handle error using the traditional `try/catch` blocks.

```javascript
class UserController {

   * show (request, response) {
       
       const userId = request.param('id')
       
       try {
           const user = yield User.findOrFail(userId)       
       } catch (e) {
           response.notFound('User not found')
       }
   
   }

}
```

## Listening To Error Event

Also you can listen for `error` event inside your `app/Listeners/Http.js` file. All unhandled exceptions will reach the event emitter giving you the final chance to catch the error and act upon it.

##### app/Listeners/Http.js
```javascript
Http.handleError = function * (error, request, response) {

    if (error.status === '404') {
        yield response.sendView('errors.404')
        return
    }
    
    response.status(error.status).send(error.message)

}
```

Error object along with **request** and **response** object is passed to the error handler so that you can make views or respond to a given HTTP request.

## Development Reporter

It is so annoying and hard to check the terminal for errors, thrown during the development lifecycle. AdonisJs makes use of [youch](http://npmjs.org/package/youch) to display pretty errors right to the web page.

##### app/Listeners/Http.js
```javascript
Http.handleError = function * (error, request, response) {

  if (Env.get('NODE_ENV') === 'development') {
    const ouch = new Ouch().pushHandler(
      new Ouch.handlers.PrettyPageHandler('blue', null, 'sublime')
    )
    ouch.handleException(error, request.request, response.response, (output) => {
      console.log('Handled error gracefully')
    })
    return
  }

})
```
