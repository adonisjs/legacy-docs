---
title: Views
permalink: views
weight: 9
categories:
- getting-started
---

AdonisJs has a solid View engine built on top of [nunjucks](http://mozilla.github.io/nunjucks/templating.html). Everything from nunjucks is fully supported with some extra features specific to AdonisJs only.

## Creating A View

Views are stored inside the `resources/views` directory. Each view file should ends with `.nunjucks` extension.

You can make use of `ace` in order to create a view file.

```bash
./ace make:view home
# on windows
ace make:view home
```

Above command will create a view to the given path `resources/view/home.nunjucks`. You are free to write plain HTML with the power of dynamic data binding.

## Basic Example

Let's create a **Route, Controller and a View** to understand the complete lifecycle of rendering dynamic HTML in AdonisJs.

##### app/Http/routes.js

```javascript
const Route = use('Route')

Route.get('/greet/:user', 'UserController.greet')
```

##### app/Http/Controllers/UserController.js

```javascript
class UserController {

  * greet (request, response) {
    const user = request.param('user')
    yield response.sendView('greet', {user})
  }

}
```

##### resources/views/greet.nunjucks

```twig
<h2> Hello {{ user }} </h2>
```


## Referencing Views

Views are referenced using the view file name. You are not required to enter the complete path or the extension of a view.

Let's take the following examples:

| Path | Referenced As |
|------|---------------|
| resources/views/home.nunjucks | response.sendView('home')
| resources/views/user/list.nunjucks | response.sendView('user.list')

## Templating

Templating refers to dynamic data binding and logical processing of data inside your views.You are required to follow a special syntax to make all this work.

#### Variables

In order to output the value of variable you make use curly braces.

```twig
{{ user }}
{{ user.firstname }}
{{ user['firstname'] }}
```

#### Conditionals

Conditionals are reference with a curly brace and a `%` sign.

```twig
{% if user.age %}
  You are {{ user.age }} years old.
{% endif %}
```

You are not only limited to a `if` condition. Views support `if, else, elseif`.

```twig
{% if hungry %}
  I am hungry
{% elif tired %}
  I am tired
{% else %}
  I am good!
{% endif %}
```

#### Filters

Filters transforms inline data and are super helpful when you want to transform data for representation only.

```twig
{# username = 'john' #}
{{ username | capitalize }}

{# output = John #}
```

Here `capitalize` is a filter to capitalise the value of a given string.

## Inheritance

Inheritance means extending a base template and overriding its individual pieces. Think of it as inheriting a Javascript Class.

Let's take the example of a master and a child view.

##### resources/views/master.nunjucks
```twig
<html>
  <body>

    <header class="header">
    {% block header %}
      Common Header
    {% endblock %}
    </header>

    <section class="sidebar">
    {% block sidebar %}
      Common Sidebar
    {% end block %}
    </section>

    <section class="content">
    {% block content %}{% endblock %}
    </section>

  </body>
</html>
```

Now you can extend this view inside any other view.

##### resources/views/home.nunjucks
```twig
{% extends 'master' %}

{% block content %}
  Here comes the content of the home page.
{% endblock %}
```


##### Output

```html
<html>
  <body>

    <header class="header">
      Common Header
    </header>

    <section class="sidebar">
      Common Sidebar
    </section>

    <section class="content">
      Here comes the content of the home page.
    </section>

  </body>
</html>
```

Below are the rules for extending templates.

1. You must create a block using the `{% block <name> %}` tag.
2. Each block must have a unique name.
3. After extending a view, you cannot place anything outside the block tags.

## Includes

You can also include different templates instead of just extending them. Including a template is commonly done when you want to share a piece of code between different templates.

Let's take an example of a chat application, where the markup for a chat message can be saved inside a different view.

##### resources/views/chat/message.nunjucks
```twig
<div class="chat__message">
  <h2> {{ message.from }} </h2>
  <p> {{ message.body }} </p>
</div>
```

In your index file you can just include the `message` view inside a loop.

##### resources/views/chat/index.nunjucks
```twig
{% for message in messages %}

  {% include 'message' %}

{% endfor %}
```

<div class="note"> Included templates shares the scope of the parent template.</div>

## Macros & Imports

Your views are not only limited to `include` and `extends`. Macros help you in defining re-usable components. 

Let's create a button component.

##### resources/views/macros/button.nunjucks
```twig
{% macro button(value, style='default') %}
  <button type="button" class="button {{style}}"> {{ value }} </button>
{% endmacro %}
```

Can you can use this macro.

##### resources/views/home.nunjucks
```twig
{% from 'macros.button' import button %}

{{ button('Create User', 'primary') }}
```

## Defining Globals

Globals are available to all the views. AdonisJs ships with some pre-defined globals and some are defined by other modules/providers.

Make use of `app/Listeners/Http.js` file to define your own globals.

##### app/Listeners/Http.js
```javascript
Http.onStart = function () {
	
  const View = use('View')
  View.global('time', new Date().getTime())

}
```

```twig
{{ time }}
```

Some globals are specific to HTTP requests, as they want to read information of each request. 

These globals are defined inside a custom middleware. For example:

##### app/Http/Middleware/ViewUrl.js
```javascript
const View = use('View')

class ViewUrl {

  * handle (request, response, next) {
    View.global('url', request.url())
  } 

}

module.exports = ViewUrl
```

Now you can access the global `url` inside all of your views.

```twig
{{ url }}
```

<div class="note"><strong>Note:</strong> Make sure to include the middleware inside the list of `globalMiddleware` inside `app/Http/kernel.js` file. </div>

## Defining Filters

AdonisJs ships with handful of filters documented [here](template-reference). You can also add your own filters, just like the way you added globals.

##### app/Listeners/Http.js
```javascript
Http.onStart = function () {
    
  const View = use('View')
  const accounting = use('accounting')

  View.filter('currency', function (amount, symbol) {
	  return accounting.formatMoney(amount, {symbol})
  })

}
```

Now you can use the above filter inside your views.

```twig
{{ 1000 | currency '$' }}

{# return $1,000.00 #}
```

[Accounting.js](http://openexchangerates.github.io/accounting.js/) is used to create the `currency` filter.

## Service Injection

You can also inject Service Providers or any bindings from the IoC container directly inside your views.

```twig
{% set User = use('App/Model/User') %}
{% yield users = User.all() %}

{% for user in users.toJSON()   %}
  {{ user.username }}
{% endfor %}
```

This is a great feature, but can open security holes when you expose your views to be edited by the outside world.

A common feature in CMS is to allow users to define partials and render them. A user defining the partial can easily inject your database models and can drop users.

You can turn this feature off inside `config/app.js` file, based on the nature of your application.

##### config/app.js
```javascript
views: {
  injectServices: false
}
```


## Caching

Views are cached automatically by AdonisJs if you have not turned off caching. 

In production it is a good practice to cache your views for better performance. Make use of `.env` file to control the caching behaviour.

##### .env
```env
CACHE_VIEWS=true
```

Above value is referenced inside the `config/app.js` file.

##### config/app.js

```javascript
views: {
  cache: Env.get('CACHE_VIEWS', true),
  injectServices: false
}
```

## Syntax Highlighting

You need to download packages for your favourite editor to have proper syntax highlighting for your `nunjucks` views.

You can also use `twig` highlighter, if you cannot find nunjucks support for your favourite editor.

1. [Atom](https://atom.io/packages/language-nunjucks).
2. [Sublime Text( Via Twig )](https://packagecontrol.io/packages/PHP-Twig).
3. [Webstorm( Via Twig )](https://plugins.jetbrains.com/plugin/7303?pr=).
4. [Brackets](https://github.com/axelboc/nunjucks-brackets/).

