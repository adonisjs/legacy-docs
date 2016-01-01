{% raw %}

# Views

Views are HTML templates with special vocabulary, very much required to write maintainable web applications.

View are stored inside `resources/views` directory and are defined with `.html` extension.

- [Simple views](#simple-views)
- [Variables](#variables)
- [Filters](#filters)
    - [builtin filters](#builtin-filters)
    - [creating filters](#creating-filters)
- [Template inheritance](#template-inheritance)
    - [include](#include)
    - [extends](#extends)
    - [import](#import)
- [Tags](#tags)
- [Expressions](#expressions)
- [Making Url](#making-url)
- [Service Injection](#service-injection)
    - [use](#use)
    - [make](#make)
    - [yield](#yield)


## Simple views

You start by creating plain .html files inside your `resources/views` directory.  For a simple view, it may look something like this.

```twig,line-numbers
<html>
<head>
  <meta charset='UTF-8'>
  <title>{% block title %} {% endblock %}</title>
</head>
<body>
  {% block content %}
  {% endblock %}
</body>
</html>
```

Above file uses standard HTML syntax with some special code blocks. `block` in Adonis is a dynamic placeholder to drop content within. Think about the above template as a master template others can extend and replace `block content` according to their needs.

```twig,line-numbers
{%extends 'master' %}

{% block content %}
    <h2>Hello world</h2>
{% endblock %}

```

## Variables

While making views, you can pass data object as 2nd parameter, which can be consumed by your views using special syntax.

```javascript,line-numbers
const view = response.view('home.html',{title:'Home'})
```

then inside your view

```twig,line-numbers
<title>
    {{title}}
</title>
```

`{{<var>}}` output value stored inside a variable, you can access nested values using dot object

```twig,line-numbers
{{user.username}}
```

or using an array-like syntax

```twig,line-numbers
{{user['username']}}
```

If a value is not defined or is null, nothing will be displayed for that variable.


## Filters

Filters are Javascript methods that can transform data on the fly while rendering your views.

```twig,line-numbers
{{title | capitalize }}
```

Here `capitalize` is a built-in filter ,which will capitalize strings before rendering your view.

### builtin filters

#### abs

Return the absolute value for given argument

```twig,line-numbers
{{ age | abs }}
```

#### batch

return batches of an object inside a loop, it is helpful when printing HTML grid.

```twig,line-numbers
{% for row in items | batch(3) %}
    <div class='row'>
        {% for item in row %}
            <div class='col-md-4'></div>
        {% endfor %}
    </div>
{% endfor %}
```

Above will create an even grid distributed in multiple rows , each containing 3 columns.

#### capitalize

Will make first character uppercase and all other lower case.

```twig,line-numbers
 {{ name | capitalize }}
```


#### default

It will show the default value if existing value is null or undefined.

```twig,line-numbers
{{title | default('Adonis') }}
```


#### escape
By default views will eliminate strings containing `&, <, >, ‘, and '` , escape will convert special characters into html safe sequences.


#### first
Returns first item from an array.

```twig,line-numbers
{{ ['foo','bar'] | first }}
```


#### groupby

Group your arrays using a defined property. See below example

```twig,line-numbers

{# setting up users array #}
{% set users = [{username:'xyz',age:22},{username:'abc',age:22},{username:'mno',age:21}] %}

{# groupby using age and show json representation #}
{{ users | groupby('age') | json }}
```


#### indent <span>(width=4,indentFirstLine=false)</span>

Indent each line inside a string with given spaces.

```twig,line-numbers
{{ text | indent(2,true) }}
```


#### join

Implementation of Javascript native join method

```twig,line-numbers
{{ [1,2,3] | join(',') }}
{# -> 1,2,3 #}
```




#### safe
Mark this value as safe and it will not be escaped by default.


## Template inheritance
Template inheritance is required and useful in writing maintainable applications, as they separate concerns by dividing
application templates into multiple files.


### include
include is useful when you want to share the same scope across other templates, it can be useful when you want to loop
through users and have a different template to display each row.

```twig,line-numbers
{# user.html #}

<h2>{{username}}</h2>
<p> {{about}} </p>
```

```twig,line-numbers
{% for user in users %}
  {% include 'user' %}
{% endfor %}

```


### extends
extends helps you extend views and replace block content whenever or wherever required.

```twig,line-numbers
{# master.html #}

<html>
  <head>
  </head>
    <body>

    {% block header %}
      <div class='header'>My App</div>
    {% endblock %}

    {% block content %}
      {# replace content #}
    {% endblock %}

    {% block footer %}
      <div class='footer'></div>
    {% endblock %}

  </body>
</html>
```

```twig,line-numbers
{# index.html #}

{% extends 'master' %}

{% block content %}
  <p> This is home page </p>
{% endblock %}

```


### import

Import loads a different template and gives you the access to exported value, imported template does not have access to any context variables. Let's start
by writing usable macros.


```twig,line-numbers
{# forms.html #}

{% macro label(text) %}
<div>
  <label>{{ text }}</label>
</div>
{% endmacro %}
```

```twig,line-numbers
{% import 'forms' as forms %}

{{ forms.label('Username') }}

```


## Tags


### if
Tests a given condition , making it easier to display logical content

```twig,line-numbers
{% if variable %}
  {# rest goes here #}
{% endif %}
```

Also, you can have multiple conditions using else if and else.

```twig,line-numbers
{% if variable %}
 variable is true
{% elif another %}
  another is true
{% else %}
  above 2 are false
{% endif %}
```


### for
for iterates over arrays and objects.

```javascript,line-numbers
var users = [{username:'foo'},{username:'bar'}]
```

```twig,line-numbers
{% for user in users %}
  {{user.username}}
{% endfor %}

```

#### over objects

```javascript,line-numbers
var games = {soccer:90,hockey:35,rugby:40}
```

```twig,line-numbers
{% for duration,game in games %}
  {{game}} is played for {{duration}} minutes
{% endfor %}

```



## Making Url
Often you have to make URL to your defined routes, `route` helper will make it easier for you to generate dynamic URLs


### Simple routes

```javascript,line-numbers
Route.get('/user/:id','UserController.show')
```

```twig,line-numbers
<a href='{{ '/user/:id' | route({id:1}) }}'> Click here to view profile </a>
```


### Named routes
Named routes makes it even easier to build fully qualified urls.

```javascript,line-numbers
Route.get('/user/:id','UserController.show').as('profile')
```

```twig,line-numbers
<a href='{{ 'profile' | route({id:1}) }}'> Click here to view profile </a>
```


## Service Injection

Services are special in Adonis, and yes you can make use of methods like `use` or can even `make` services right into your views.


### use
`use` is a special keyword to require modules using namespaces , you can access use right into your views.

```twig,line-numbers
{% set UserModel = use('App/Models/User') %}
```


### make
`make` works same as `use`, but instead it makes an instance of Class magically by injecting all required dependencies out of the box,
you can read more about it [@Ioc container](/ioc-container)



### yield
`yield` let you run Es6 generators right into your views, it can become very handy to make Database queries right from views. Which may or may not the right choice depending upon your application nature.


```twig,line-numbers
{% set UserModel = use('App/Model/User') %}
{% yield users = UserModel.all() %}

{% for user in users.toJSON()   %}
  {{ user.username }}
{% endfor %}
```


{% endraw %}
