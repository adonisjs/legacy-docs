---
title: Controllers
permalink: controllers
weight: 4
categories:
	- basics
---

Controllers are C in MVC, they bind your models to your views while responding to a given HTTP Request.

{{TOC}}

By the end of this guide you will know:

1. How to create controllers and define actions on them.
2. How to create resourceful routes and controllers.
3. How to inject dependencies to your controllers.

## Creating Controllers

Controllers live inside `app/Http/Controllers` directory. In order to keep your code maintainable, you are free to create nested directories inside the Controllers directory.

Make use of `ace` to create a new controller.

```bash
./ace make:controller User
# or
./ace make:controller User --resource
```

`--resource` flag will create a resourceful controller. We will learn more about it in a minute.

Above command will create `UserController.js` file inside the Controllers directory.

**app/Http/Controllers/UserController.js**
```javascript
class UserController {

	* index (request, response) {
		
	}

}

module.exports = UserController
```

## Binding Controllers to Routes

Binding controllers to routes is quite simple.

**app/Http/routes.js**
```javascript
const Route = use('Route')

Route.get('/users', 'UserController.index')
```

A Controller is referenced as a string. 

1. The first part before the `dot(.)` is a reference to the controller file. Which is `UserController`.
2. Second part is the reference to the method on the controller. Which is `index`.

You can reference nested controllers using the directory separator `/`.

```javascript
Route.get('/users', 'Admin/UserController.index')
```

## ResourceFul Routes

CRUD applications are built on the idea of Creating, Reading, Updating and Deleting records from a database table.

Since these are very common operations, Adonis helps you in defining conventional routes and their Controller actions using a term called `resource.`

### Creating Resource

While defining a resource, we bind the controller name with the method, since we are not defining a single route. Resources will create handful of routes.

#### resources(name, Controller)
```javascript
const Route = use('Route')

Route.resources('users', 'UserController')
```

| Url | Verb | Controller Method | Purpose
|----|-------------------|------------
| /users | GET | index | Show list of all users
| /users/create | GET | create | Display a form to create a new user.
| /users | POST | store | Create a new user
| /users/:id | GET | show | Display a user using the id
| /users/:id/edit | GET | edit | Display the form to edit the user.
| /users/:id | PUT/PATCH | update | Update details for a given user id
| /users/:id | DELETE | destroy | Delete a given user with id.


### Filtering Urls

`resources` will create total of 7 routes. May or may not these route are required by your applications. 

#### except(actions)
```javascript
Route
	.resource('users', 'UserController')
	.except('create', 'edit')
```

Above definition will not register the route for `create` and `edit` actions.

#### only(actions)

`only` is the opposite of except.

```javascript
Route
	.resource('users', 'UserController')
	.only('store', 'update', 'index')
```

### Extending Resources

Apart from filtering, resources can also be extended to add more actions to them.

#### addCollection(route, [verbs=GET])

```javascript
Route
	.resource('posts', 'PostController')
	.addCollection('popular')
```

Above will add a new route and action to your resource called `popular`.

| Url | Verb | Controller Method | Purpose
|----|-------------------|------------
| /posts/popular | GET | popular | Display popular blog posts.

Also you can define different/multiple verbs when trying to add a new collection.

```javascript
Route
	.resource('posts', 'PostController')
	.addCollection('guest', ['POST'])
```

#### addMember(route, [verbs=GET))

`addMember` requires an Id to work.

```javascript
Route
	.resource('posts', 'PostController')
	.addMember('comments')
```

Above will add comments route to the posts resource.

| Url | Verb | Controller Method | Purpose
|----|-------------------|------------
| /posts/:id/comments | GET | comments | List all comments for a given posts.

## Dependency Injection

[Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)  is a way to inject dependencies instead of requiring them. There is a dedicated guide for that, you can read it [here](dependency-injection).

Dependencies injected to your controllers are resolved automatically behind the scenes.

### Using Inject

```javascript
class UserController {

	static get inject () {
		return ['App/Model/User']
	}
	
	constructor (User) {
		this.user = User
	}

}
```

Here we are injecting the `User Model` to the controller constructor instead of `requiring` it.

static `inject` getter tells the IoC container to inject the given dependencies to the constructor.

### Type Hinting

You can also make use of type hinting, in which there is no need to use `inject` method.

```javascript
class UserController {

	
	constructor (App_Model_User) {
		this.user = App_Model_User 
	}

}
```

Behind the scenes `App_Model_User` will be converted to `App/Model/User` and will be injected to your controller.

<div class="note">
<strong>Note</strong>: Typehinting has no advantage over static inject method, it is all about personal preference.
</div>