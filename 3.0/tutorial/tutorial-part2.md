---
title: Routes And Controllers
permalink: adonis-blog-part2
description: Tutorial - How Routes and Controllers work in AdonisJs
weight: 1
categories:
- tutorial
---

{{TOC}}

In the [last tutorial](adonis-blog-part1) we created a new app and registered routes to render views without making use of Controllers.

Rendering simple views without Controllers is fine but in order to build real apps you need to deal with Domain logic and create views with dynamic data. In this tutorial, we will learn how to create controllers and bind them to routes.

## Creating Controllers

Controllers are `ES2015` classes stored inside `app/Http/Controllers` directory. Each file defines a single controller and you are free to create as many methods as you want on a single controller.

Let's dive in quickly and create a new controller. Since we will turn this app into a blog, let's name the controller `PostController`. As always we are going to make use of `ace` to create the controller for us.

```bash
./ace make:controller Post
```

Output

```bash
create: app/Http/Controllers/PostController.js
```

We have created our first controller. Let's bind this controller to the route and render a view from the controller instead.

##### app/Http/routes.js
```javascript
Route.get('/', 'PostController.index')
```

Make sure to replace `Route.on('/').render('home')` with the above route definition. The final routes file will look like:

```javascript
const Route = use('Route')

Route.get('/', 'PostController.index')
Route.on('/about').render('about')
Route.on('/contact').render('contact')
```

There is a complete guide on [Routes](/docs/routing) you can reference. For now, we will write some code inside the `PostController` to render a view.

##### app/Http/Controllers/PostController.js
```javascript
'use strict'

class PostController {

  * index (request, response) {
    yield response.sendView('home')
  }

}

module.exports = PostController
```

Here we created a method called `index` inside the PostController class. All route actions are [ES2015](https://strongloop.com/strongblog/write-your-own-co-using-es2015-generators/) generator methods. Which means you can get rid of `callbacks` and make use of shiny new `yield` keyword. 

Also, each route action will have access to the HTTP **request** and **response** object. Just like **req** and **res** in Express.Js, but we call them with their full names.

`response.sendView` will respond back to the HTTP request by rendering an HTML view. So refresh the browser and you will see the same result as earlier but this time using the Controller.