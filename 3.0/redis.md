---
title: Redis
permalink: redis
description: Make use of redis in AdonisJs using a lean service provider.
weight: 9
categories:
- providers
---

{{TOC}}

Redis provider makes it so simple to work with [redis](http://redis.io/). It has out of the box support for **multiple redis connections**, **cluster**, **sentinel**, **transactions** and **pub/sub**.

Internally it makes use of [ioredis](https://github.com/luin/ioredis) but the API is slightly different to keep your code maintainable and readable.

## Setup

Redis provider is not shipped with the base installation of AdonisJs, which means you are required to install and set it up manually.

```bash
npm i --save adonis-redis
```

After installation, you need to register the providers inside `bootstrap/app.js` file.

##### bootstrap/app.js

```javascript
const providers = [
  ...,
  'adonis-redis/providers/RedisFactoryProvider',
  'adonis-redis/providers/RedisProvider'
]
```

Also, it is a good practice to setup an alias to avoid typing the complete namespace.

##### bootstrap/app.js
```javascript
const aliases = {
  Redis: 'Adonis/Addons/Redis'
}
```

## Config

Next, you need to setup a config file to define the connection settings to be used by the Redis provider. Same needs to be done inside `config/redis.js` file. [Download sample configuration file](https://raw.githubusercontent.com/adonisjs/adonis-redis/develop/examples/redis.js).

#### Options

Redis provider supports all available options from Io Redis. [Here is the list of supported options](https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options).

## Basic Example

Once everything is configured, you are good to make use of Redis inside your AdonisJs applications. Let's start with a basic example of caching users inside redis.

##### app/Http/Controllers/UserController.js
```javascript
'use strict'

const Redis = use('Redis')
const User = use('App/Model/User')

class UserController {

  * index (request, response) {
    const cachedUsers = yield Redis.get('users')
    if (cachedUsers) {
      response.json(JSON.parse(cachedUsers))
      return
    }

    const users = yield User.all()
    yield Redis.set('users', JSON.stringify(users))
    response.json(users)
  }

}

module.exports = UserController
```

Of course, this is not the best example of caching users, but you do get the idea on how to make use of redis commands.

## Redis Commands

All redis [commands](http://redis.io/commands) are supported as javascript functions. For example:

```javascript
'use strict'

const Redis = use('Redis')
const user = {
  username: 'foo',
  email: 'foo@bar.com'
}

yield Redis.hmset('users', user.username, JSON.stringify(user))

const user = yield Redis.hmget('users', user.username) // returns stringified JSON
```

## Pub/Sub

Redis has built-in support for Pub/Sub to share messages on same or across multiple servers. AdonisJs offers a clean API to subscribe and publish messages without any extra efforts.

It is recommended to create a new file inside `bootstrap` directory to register subscribers.

##### bootstrap/redis.js

```javascript
'use strict'

const Redis = use('Redis')

Redis.subscribe('music', function * (track) {
  console.log('received track', track)
})
```

Next, you need to require this file inside `bootstrap/http.js` file to make sure it is loaded while booting the HTTP server just after the `require('./events')` statement.

##### bootstrap/http.js
```javascript
require('./redis')
```

Now anywhere inside your application, you can publish to the `music` channel and the registerted listener will be called.

```javascript
'use strict'

const Redis = use('Redis')

Route.get('/music/store', function * (request, response) {
  Redis.publish('music', request.all())
})
```

## Pub/Sub Methods

#### subscribe(channel, listener)

```javascript
Redis.subscribe('music', function (track, channel) {
  console.log(track)
})
```

`listener` can also be a reference to a module inside `app/Listeners` directory.

```javascript
Redis.subscribe('music', 'Music.newTrack')
```

##### app/Listeners/Music.js

```javascript
'use strict'

const Music = exports = module.exports = {}

Music.newTrack = function (track, channel) {
  console.log(track)
}
```

#### psubscribe(channel, listener)

`psubscribe` will subscribe to a **pattern** and messages to any matched channel will be sent to the listener.

```javascript
Redis.psubscribe('h?llo', function (message, channel, pattern) {
  
})

Redis.publish('hello')
Redis.publish('hallo')
```

#### publish

```javascript
Redis.publish('music', {id: 1, title: 'Love me like you do', artist: 'Ellie goulding'})
```

#### unsubscribe(channel, [callback])

Unsubscribe from a given channel.

```javascript
Redis.unsubscribe('music')
```


#### punsubscribe(pattern, [callback])

Unsubscribe from a given pattern.

```javascript
Redis.punsubscribe('h?llo')
```

## Transactions

Transactions are really helpful when you want to perform bulk operations at a given point of time. Let's review an example of adding users to a list.

```javascript
'use strict'

'use strict'

const User = use('App/Model/User')
const Redis = use('Redis')

class UserController {

  * index (request, response) {
    const users = yield User.all()

    // Creating a transaction
    const multi = Redis.multi()
    users.each((user) => {
      multi.lpush('users-list', JSON.stringify(user))
    })
    yield multi.exec()

    response.json(users)
  }

}

module.exports = UserController
```

<div class="note">
  <strong>Note</strong> <code>lpush</code> will push the same users multiple times if you refresh the webpage more than once.
</div>

#### multi

Creates a new transaction to call multiple commands and execute them together.

```javascript
const multi = Redis.multi()
multi
  .set('foo', 'bar')
  .set('bar', 'baz')

const response = yield multi.exec()
// [[null, 'OK'], [null, 'OK']]
```


## Pipelines

Pipelines are quite similar to **transactions** but they do not guarantee that all commands will be executed in a transaction. Pipelines are helpful in sending a batch of commands to save network round trips.

#### pipeline
```javascript
const pipeline = Redis.pipeline()
pipeline
  .set('foo', 'bar')
  .set('bar', 'baz')

const response = yield pipeline.exec()
// [[null, 'OK'], [null, 'OK']]
```

## Multiple Connections

You can define the configuration for multiple connections inside the `config/redis.js` file and you can use those connections by calling the `connection` method.

##### config/redis.js
```javascript
module.exports = {
  connection: 'local',

  local: {
    ...
  },

  secondary: {
    host: 'myhost.com',
    port: 6379
  }

}
```

```javascript
yield Redis.connection('secondary').get('users')
```

AdonisJs creates a connection pool, which means all created connections are long-lived unless you close them manually.

#### quit([...connections])

Closes a single, multiple or all connections. 

```javascript
const response = yield Redis.quit('secondary')
// or
const response = yield Redis.quit() // close all connections
```

## LifeCycle Events

You can listen for lifecycle events inside `bootstrap/redis.js` file.

##### bootstrap/redis.js
```javascript
'use strict'

const Redis = use('Redis')

Redis.on('error', function (error) {

})
```

[Here](https://github.com/luin/ioredis#connection-events) is the list of lifecycle events.
