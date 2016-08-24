---
title: Controllers
permalink: controllers
description: Creating and defining controllers in AdonisJs
weight: 1
categories:
- guides
---

{{TOC}}

Controllers are attached to routes and are the common point of interaction between your models and views.

In typical Web applications, you will begin by binding a controller method to your route, make use of models to fetch data and send that data to view to render HTML.

## Basic Example

You bind controller methods as a **String** to your route. AdonisJs will automatically resolve the appropriate model from this string.

```javascript
Route.get('/users', 'UsersController.index')
```

Next you need to create the controller method inside the controller class.

```javascript

const User = use('App/Model/User')

class UsersController {

  * index (request, response) {		
    const users = yield User.all()
    yield response.sendView('users', { users: users.toJSON() })
  }

}
```

And inside your `users.njk` view, you can run a **for** loop to show a list of all the users.

```twig
{%for user in users %}
  <h2>{{ user.username }}</h2>
{% endfor %}
```

## Creating Controllers

Controllers live inside `app/Http/Controllers` directory. In order to keep your code maintainable, you are free to create nested directories inside the Controllers directory.

Make use of `ace` to create a new controller.

```bash
./ace make:controller User
# or
./ace make:controller User --resource
```

`--resource` flag will create a resourceful controller. We will learn more about it in a while.

Above command will create `UserController.js` file inside the Controllers directory.

## Basic Controller

```javascript
class UserController {

  * index (request, response) {
    response.send('Hello world from controller!')   
  }

}

module.exports = UserController
```


## Binding Controllers to Routes

Binding controllers to routes is quite simple.

##### app/Http/routes.js
```javascript
const Route = use('Route')

Route.get('/users', 'UserController.index')
```

1. A Controller is referenced as a string.
2. The first part before the `dot(.)` is a reference to the controller file. Which is `UserController`.
3. Second part is the reference to the method on the controller. Which is `index`.

You can also reference nested controllers using the directory separator `/`.

```javascript
Route.get('/users', 'Admin/UserController.index')
```

## ResourceFul Routes

CRUD applications are built on the idea of **Creating, Reading, Updating and Deleting** records from a database table.

Since these are very common operations, AdonisJs helps you in defining conventional routes and their Controller actions using a term called `resource`.

#### resources(name, Controller)
```javascript
const Route = use('Route')

Route.resources('users', 'UserController')
```

Above code will bind 7 routes automatically for you.

| Url | Verb | Controller Method | Purpose |
|-----|------|-------------------|---------| 
| /users | GET | index | Show list of all users |
| /users/create | GET | create | Display a form to create a new user. |
| /users | POST | store | Save user submitted via form to the database. |
| /users/:id | GET | show | Display user details using the id |
| /users/:id/edit | GET | edit | Display the form to edit the user. |
| /users/:id | PUT/PATCH | update | Update details for a given user with id. |
| /users/:id | DELETE | destroy | Delete a given user with id. |

## Filtering Resources

`resources` will create total of 7 routes. Depending upon the nature of your application, you might or might not require all routes.

#### except(...actions)

`except` will not register routes for the given actions.
```javascript
Route
  .resource('users', 'UserController')
  .except('create', 'edit')
```

Above definition will not register the route for `create` and `edit` actions.

#### only(...actions)

`only` is the opposite of except.

```javascript
Route
  .resource('users', 'UserController')
  .only('store', 'update', 'index')
```

## Extending Resources

Apart from filtering, resources can also be extended to add more actions to them.

#### addCollection(route, [verbs=GET], [closure])

```javascript
Route
  .resource('posts', 'PostController')
  .addCollection('popular')
```

Above will add a new route and action to your resource called `popular`.

| Url | Verb | Controller Method | Purpose |
|----|-------|-------------------|----------|
| /posts/popular | GET | popular | Display popular blog posts. |

Also you can define different/multiple verbs when trying to add a new collection.

```javascript
Route
  .resource('posts', 'PostController')
  .addCollection('guest', ['POST'])
```

Not only you are limited to defining simple collections, taking a step further can unlock more feature of defining custom controller actions or binding middleware.

```javascript
Route
  .resource('posts', 'PostController')
  .addCollection('comments', ['GET'], (collection) => {
    collection.bindAction('showComments').as('post.comments.show')
  })
  .addCollection('comments', ['POST'], (collection) => {
    collection.bindAction('storeComments').as('post.comments.store')
  })
```

#### addMember(route, [verbs=GET), [closure])

`addMember` requires an Id to work.

```javascript
Route
  .resource('posts', 'PostController')
  .addMember('comments')
```

<div class="note">
  Members can also be extended same as the **collections**.
</div>

Above will add comments route to the posts resource.

| Url | Verb | Controller Method | Purpose |
|----|-------|-------------------|---------|
| /posts/:id/comments | GET | comments | List all comments for a given posts.|
