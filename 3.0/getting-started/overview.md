---
title: Overview
description: Overview to AdonisJs
permalink: overview
weight: 0
categories:
- getting-started
---

{{TOC}}

AdonisJs is a Node.js MVC Framework. It encapsulates the boring parts of Web development and offers you a nice API to work with.

Every web application needs following at a certain stage. 

1. Powerful ORM to make secure SQL queries.
2. Authentication System.
3. An easy way to send emails.
4. Validate and Sanitise user inputs.
5. Structured application layout.

AdonisJs has all of this built right into the framework or can be added by using one of the official library/modules.

This guide is geared to give you an in-depth understanding of how AdonisJS works. Watch the below video, if you are interested in seeing how AdonisJs solves a practical problem.

<div class="embed-responsive embed-responsive-16by9">
    <iframe width="640" height="390" src="https://www.youtube.com/embed/4MB0_X1fm5k" frameborder="0" allowfullscreen></iframe>
</div>

## Simplest Example

AdonisJs attempts to remove the big pieces of unmanageable code with simple readable API's. For example

```javascript
const Route = use('Route')
const User = use('App/Model/User')

Route.get('/', function * (request, response) {
    const users = yield User.all()
    response.json(users)
})
```

Don't worry, if you do not fully understand the above code, but you can see within 6 lines of code, you are able to fetch all users from a database and send them back as `JSON` response.

1. AdonisJs removes the unnecessary callbacks from your code and introduces ES2015 Generators.
2. It organizes everything into different/multiple directories so that you can keep your files short and sweet.
3. It does not add anything to the globals except the `use` and `make` function. Don't worry, we will learn about them soon.

## MVC

MVC stands for **Model**, **View** and **Controller**.

![](http://res.cloudinary.com/adonisjs/image/upload/v1472842310/MVC-Flow-Chart_ccz2zb.jpg)

1. Model is the layer of data you retrieve/persist to the SQL databases like MySQL, SQLite, PostgreSQL etc.
2. Controller is a method which responds to an HTTP request, this is the place where you interact with your Model to fetch data and send it to your views.
3. View is `.njk` file, which contains the HTML layout of your web page. Instead of just plain HTML, views offer a dynamic data binding syntax.

##### Model

```javascript
'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
  // Your code
}
```

##### Controller
```javascript
'use strict'

const User = use('App/Model/User')

class UserController {
 
  * show (request, response) {
      const user = yield User.find(1)

      yield response.sendView('user', { user: user.toJSON() })
  }

}
```

##### View
```twig
Username - {{ user.username }}
Email - {{ user.email }}
```


## IoC Container

Writing server applications requires a lot of work and needs to be organized within multiple files and directories to keep code maintainable and readable.

IoC Container is a box to store all the pieces of your application so that you can use them whenever you need them. When these pieces are stored inside the container, they are given a unique namespace.

![](http://res.cloudinary.com/adonisjs/image/upload/v1472842329/Ioc-container_bq7die.jpg)


`use` keyword is a function added to the globals by the IoC Container. It works same as the standard `require` function. Which means.

```javascript
const fs = require('fs')
```

is equivalent to

```javascript
const fs = use('fs')
```


But it does a lot more than `require` and is specific to AdonisJs. 

### How use Works?

When you say `use('Route')`, following steps are being performed.


1. It will look for the alias called `Route` and find the namespace next to it.
2. Next, it will look for the resolved namespace inside the container.
3. Finally, it will return the value bind to the container for the given namespace.

A complete cookbook is dedicated to the IoC Container, as it is a very broad concept. Read about it [here](https://www.gitbook.com/book/adonisjs/journeyman-guide-to-ioc-container).
