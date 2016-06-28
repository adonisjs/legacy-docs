---
title: Authentication
permalink: authentication
description: User Authentication In AdonisJs
weight: 0
categories:
- providers
---

{{TOC}}

Every Web application deals with User management and Log in at some stage. AdonisJs Authentication provider is a fully featured system to authenticate HTTP requests using multiple authenticators.

Using AdonisJs authenticators, you can build traditional session-based login systems to secure REST API's.

## Authenticators

Each authenticator is a combination of a Serializers and an authentication scheme. Below is the list of supported schemes.

1. Sessions (session)
2. Basic Auth (basic)
3. JWT (jwt)
4. Personal API Tokens (api)

And AdonisJs has support for following Serializers.

1. Lucid
2. Database

## Config

Configuration for Auth is saved inside the `config/auth.js` file, that is configured to make use of `session` authenticator by default.

##### config/auth.js
```javascript
module.exports = {

    authenticator: 'session',

    session: {
        serializer: 'Lucid',
        scheme: 'session',
        model: 'App/Model/User',
        uid: 'email',
        password: 'password'    
    }
}
```

| Key | Values | Description|
|-----|--------|------------|
| serializer | Lucid,Database | Serializer to be used for fetching the user from the database.
| scheme | session,basic,jwt,api | Scheme to be used for fetching and authenticating user credentials.
| model | Model Namespace | Applicable only when using `Lucid` serializer. Given model will be used for querying the database.
| uid | Database field name | Database field to be used as unique identifier for a given user.
| password | Database field name | Field to be used for verifying user password |
| table | Database table name | Applicable only when using `Database` serializer.


## Setup

Every new application comes with a pre-configured Authentication provider. In case, if you are upgrading an old project, follow the below steps to configure it from scratch. 

```bash
npm i --save adonis-auth
```

Next, you need to register the authentication provider to the providers list.

##### bootstrap/app.js
```javascript
const providers = [
    ...,
    'adonis-auth/providers/AuthManagerProvider'
]
```

Once you have registered the provider, you are required to setup a global middleware. It will decorate the `request` object by attaching the `auth` object to it.

##### app/Http/kernel.js
```javascript
const globalMiddleware = [
  ...,
  'Adonis/Middleware/AuthInit'
]
```

That's all! Now each request will have access to the `request.auth` object. Based upon the authenticator you are using, you can login/authenticate users.

## Migrations & Models

Authentication provider can generate required migrations for you using an `ace` command. Just make sure following command is added to the list of commands.

##### bootstrap/app.js
```javascript
const commands = [
    ...,
    'Adonis/Commands/Auth:Setup'
]
```

```bash
./ace auth:setup
# on windows
ace auth:setup
```

Above command will output

```bash
create: app/Model/User.js
create: database/migrations/1463212428511_User.js
create: app/Model/Token.js
create: database/migrations/1463212428512_Token.js
```

## Types Of Authentication

Authentication is generally divided into two broad categories called Stateless authentication and Stateful authentication.

Stateful authentication is managed by sessions, where you authenticate a user only once for a given period of time.

Whereas, Stateless authentication can be done using [Basic Auth](https://en.wikipedia.org/wiki/Basic_access_authentication), [JWT Tokens](https://jwt.io/introduction/) etc. AdonisJs has out of the box support for both.

Let's review the session based authentication with a simple basic example.

## Basic Example

In this example, we will register a couple of routes to log in a user and show them protected resources only when they are logged in.

##### app/Http/routes.js
```javascript
Route.get('/profile', 'UserController.profile')
Route.post('/login', 'UserController.login')
```

##### app/Http/Controllers/UserController.js

```javascript
class UserController {
    
    * login (request, response) {
        const email = request.input('email')
        const password = request.input('password')
        const login = yield request.auth.attempt(email, password)
    
        if (login) {
            response.send('Logged In Successfully')
            return
        }
        
        response.unathorized('Invalid credentails')
    }

}
```

Above method will a log in a user using their email address and password. Let's write another method to show a profile of a user, only if they are logged in.

##### app/Http/Controllers/UserController.js

```javascript
* profile (request, response) {
    const user = yield request.auth.getUser()
    
    if (user) {
        response.ok(user)
        return
    }
    
    response.unathorized('You must login to view your profile')
    
}
```

That's all you really need to do, to setup a simple authentication process.

## Session Based Authentication

Below is the list of available methods for session based authentication.

#### attempt(uid, password)

Attempt to log in a user using the uid and password. It will throw an error if unable to find the user or if password mismatch.

```javascript
yield request.auth.attempt(uid, password)
```

#### login(user)

Login a user using the user instance.

```javascript
const user = yield User.find(1)
yield request.auth.login(user)
```

#### loginViaId(id)

Login a user using the id. A database lookup will be performed to make sure the user does exist.

```javascript
yield request.auth.loginViaId(1)
```

#### logout

```javascript
yield request.auth.logout()
```

#### check

Check to see if a user is logged in or not.

```javascript
yield request.auth.check()
```

#### validate(uid, password)

Validate user credentials to see if they are valid. `validate` method does not perform a login.

```javascript
const isValid = yield request.auth.validate(uid, password)
```

## Basic Auth

If you are using basic auth as your primary authenticator, then below is the list of methods you can call.

1. check
2. validate

Since basic auth is a stateless authentication, there is no concept of login or logout.

## JWT

JWT configuration options are little different from Session and Basic Auth.

##### config/auth.js
```javascript
jwt: {
  serializer: 'Lucid',
  scheme: 'jwt',
  model: 'App/Model/User',
  secret: Config.get('app.appKey'),
  options: {
      // Options to be used while generating token
  }
}
```

Below is the list  of available options to be defined inside the `config.js` file.

| Key | Available Values |Default Value | Description |
|-----|------------------|--------------|-------------|
|algorithm | HS256, HS384 | HS256 | Algorithm to be used for generating token|
| expiresIn | valid time in seconds or [ms string](https://github.com/rauchg/ms.js) | null | When to expire the token |
| notBefore | valid time in seconds or [ms string](https://github.com/rauchg/ms.js) | null | At Least till when to keep the token valid |
| audience | String | null | A value to checked against the `aud`|
| issuer | Array or String | null | Value to be used for `iss`.
| subject | String | null | A value to be checked against the `sub`.

JWT is also stateless authentication and below is the list of available methods.

#### check

Works same as others

```javascript
const isLoggedIn = yield request.auth.check()
```

#### generate(user)

Generates a JWT token for a given user.

```javascript
const user = yield User.find(1)
const token = yield request.auth.generate(user)
```

## API Tokens

Personal API tokens are like the password for a given account. The majority of Web applications offers API-based authentication so that their customers can generate these tokens for developers without sharing their actual Login details.

##### config/auth.js
```javascript
api: {
  serializer: 'Lucid',
  scheme: 'api',
  model: 'App/Model/Token',
  expiry: '30d'
}
```

Also, API Tokens operates on a `Token` model but they do need a relationship with the `User` model to fetch the user for a given token.

Make use of `ace auth:setup` command to create required models with relationship or setup them manually as defined below.

##### app/Model/Token.js
```javascript
'use strict'

const Lucid = use('Lucid')

class Token extends Lucid {

    user () {
        return this.belongsTo('App/Model/User')
    }

}

module.exports = Token
```

Also `User` Model should have the reverse relationship.

##### app/Model/User.js
```javascript
'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

    apiTokens () {
        return this.hasMany('App/Model/Token')
    }

}

module.exports = User
```

Now you can make use of available methods to authenticate a user or revoke their tokens.

#### check

Works same as others

```javascript
const isLoggedIn = yield request.auth.check()
```

#### generate(user, [expiry])

Generate an API token for a given user and save it to the database.

```javascript
const user = yield User.find(1)
const token = yield request.auth.generate(user)
```

#### revoke(user, tokens=Array)

Revoke/Delete given tokens for a given user.

```javascript
const user = yield User.find(1)
yield request.auth.revoke(user, [token])
```

#### revokeAll(user)

Revoke/Delete all tokens for a given user.

```javascript
const user = yield User.find(1)
yield request.auth.revokeAll(user)
```

#### revokeExcept(user, tokens=Array)

Revoke all tokens except the given ones.

```javascript
const user = yield User.find(1)
yield request.auth.revokeExcept(user, [token])
```

## Auth Middleware

So far you have been authenticating users manually, which can lead to duplicate code in multiple controllers. AdonisJs Auth Middleware can automatically authenticate your routes and makes sure to deny the requests when the end-user is not logged in.

Make sure `Auth` Middleware is registered as a named middleware inside `app/Http/kernel.js` file.

##### app/Http/kernel.js

```javascript
const namedMiddleware = {
    auth: 'Adonis/Middleware/Auth'
}
```

Now you are all set to assign use of `auth` key to your routes.

##### app/Http/routes.js
```javascript
Route
    .get('/user/profile', 'UserController.profile')
    .middleware('auth')
```

## Defining Different Authenticator 

You can also define different authenticator to your auth middleware key.

```javascript
Route
    .get('/user/profile', 'UserController.profile')
    .middleware('auth:basic')
```

This one will make use of `basic` authenticator defined inside your `config/auth.js` file.

## Multiple Authenticators

It is a very common practice to make use of multiple authenticators when trying to authenticate a user. 

**For example**: Creating REST API with the support of Basic Auth and JWT.

```javascript
Route
    .get('/user/profile', 'UserController.profile')
    .middleware('auth:basic,jwt')
```

Auth Middleware will try to authenticate users using all the defined authenticators and will stop as soon as the user gets authenticated, otherwise, it will throw `InvalidLoginException`.

## Switching Between Authenticators

You can also switch between different authenticators using the `authenticator` method.

```javascript
const jwt = request.auth.authenticator('jwt')
const basicAuth = request.auth.authenticator('basic')
const api = request.auth.authenticator('api')

yield jwt.check()
yield basicAuth.check()
yield api.check()
```

## Helpers

When making use of `session` authenticator, all views and controllers will have access to the currently logged in user.

```javascript
request.currentUser // logged in user
```

Inside your views, you can make use of a global.

```twig
{{ currentUser }}
```

When making use of stateless authenticators like **jwt**, **api**, etc. Currently authenticated request will have a `user` property.

```javascript
request.auth  // authenticated user instance
```

<div class="note">
    <strong>Note: </strong> <code>request.auth</code> is only available when you make use of named middleware called <code>auth</code>.
</div>
