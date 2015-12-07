
{% raw %}

# Views

Adonis ships with a beautiful template engine to create dynamic HTML pages. Views are stored inside `resources/views` directory and are defined with `.html` extension.

- [Basic views](#basic-views)
- [Variables](#variables)
- [Tags](#tags)
- [Filters](#filters)
- [Inheritance](#inheritance)
  - [include](#include)
  - [extends](#extends)
  - [import](#import)
- [Expressions](#expressions)
- [Auto Escaping](#auto-escaping)
- [Service Injection](#service-injection)
- [Extending Views](#extending-views)

## Basic Views

You can make use of views inside your controllers and middleware through response object, and here we will talk about defining views using rich templating vocabulary. For the most basic view, you create a file with `.html` extension.

```twig,line-numbers
{# resources/views/master.html #}
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

above is a master view with shared HTML markup, now you can extend this view and replace blocks with your defined content.

```twig,line-numbers
{# resources/views/index.html #}

{% extends 'master' %}

{% block title %}
  Home Page
{% endblock %}

{% block content %}
  <h2> Hello World </h2>
{% endblock %}
```

## Variables

While making views, you can pass a data object as the second parameter, which can be consumed by your views using special syntax.

```twig,line-numbers
yield response.view('index', {title: 'Home'})
```

```twig,line-numbers
<title>
  {{ title }}
</title>
```

## Tags

Tags are keywords that can be used to manipulate and display data in your views, think of them as javascript keywords but inside HTML.

### if

```twig,line-numbers
{% if age > '18' %}
  You are allowed to drive
{% endif %}
```

also, you can make use of `else` and `elif`

```twig,line-numbers
{% if age > '60' %}
  You probably should not drive
{% elif age > '18' %}
  You are allowed to drive
{% else %}
  You need a license first
{% endif %}
```

### for

For loop will help you in iterating over arrays and objects.

```javascript,line-numbers
var users = [{username: 'doe', age: 22}, {username: 'dim', age: 30}]
```

```twig,line-numbers
{% for user in users %}
  <li>
    <h2> {{ user.username }} </h2>
    <span> {{ user.age }} </span>
  </li>
{% endfor %}
```

You can also loop through a flat object and access its keys and values.

```javascript,line-numbers
var games = {soccer: 90, hockey: 35, rugby: 40}
```

```twig,line-numbers
{% for game,duration in games %}
  <li> {{ game }} is played for {{ duration }} minutes </li>
{% endfor %}
```

Finally, you can combine `else` statement with `for` loop to show something when the data object is empty.

```twig,line-numbers
{% for user in users %}
  <h2> {{ user.username }} </h2>
{% else %}
  <p> There are no users, why not create one ?</p>
{% endfor %}
```

### set

Set helps in declaring variables inside HTML templates, think of them as replacement to `var`

```twig,line-numbers
{% set username="doe" %}
{{ username }}
```

### raw

The raw tag is helpful when you want to ignore a set of code to be processed by the template engine. It is useful when you are using frontend data binding libraries like Angular or VueJs.

```twig,line-numbers
{% raw %}
  {{2 + 2}} will not be processed
{% endraw %}
```

### block
Block tag defines a block with unique name, and data inside that block can be overridden later.

```twig,line-numbers
{% block title %}
  This is the default title
{% endblock %}

{% block title %}
  This is my title overriding default title
{% endblock %}
```

## Filters
Filters are small methods to transform inline data. For Example

```twig,line-numbers
{{ "hello world" | capitalize }}
```
Here `capitalize` filter will turn hello world into Hello world.

Also, there are multiple ways to call a filter, depending upon your situation, you can choose the preferred one.

### using pipe (|) symbol
```twig,line-numbers
{{ "hello world" | capitalize }}
```

### using filter tag
```twig,line-numbers
{% filter capitalize %}
  Hello world
{% endfilter %}
```

### Built-in filters
Adonis ships with a handful of commonly used filters. Also, you are free to add your own filters.

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

#### capitalize
Will make first character uppercase and all other lower case.

```twig,line-numbers
{{ name | capitalize }}
```

#### default
It will show the default value if existing value is null or undefined.

```twig,line-numbers
{{ title | default('Adonis') }}
```

#### escape
By default views will eliminate strings containing `&, <, >, ‘, and '`, escape will convert special characters into html safe sequences.

#### first
Returns first item from an array.

```twig,line-numbers
{{ ['foo','bar'] | first }}
```

#### groupby
Group your arrays using a defined property. See below example

```twig,line-numbers
{# setting up users array #}
{% set users = [{username:'doe',age:22},{username:'dim',age:22},{username:'dock',age:21}] %}

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

#### json
Shows JSON representation of an array or Object

```twig,line-numbers
{{ [{username:'foo'}] | json }}
```

#### last
Returns last item from an array.

```twig,line-numbers
{{ ['foo','bar'] | last }}
```

#### length
Returns length of an array.

```twig,line-numbers
{{ ['foo','bar'] | length }}
```

#### list
Converts an array into a list, think of it as replacement to `join`, but it also works for strings.

```twig,line-numbers
{{ ['foo','bar'] | list }}
{# -> foo, bar #}
```

#### lower
Converts value to lowercase

```twig,line-numbers
{{ "Hello World" | lower }}
{# -> hello world #}
```

#### random
Returns random item from an array

```twig,line-numbers
{{ ['foo', 'bar', 'baz'] | random }}
```

#### rejectattr
Filters an array and remove objects containing defined attributes

```twig,line-numbers
{% set users = [{username: 'doe', age: 22, admin: true}, {username: 'dim', age: 22, admin: false}] %}
{{ users | rejectattr('admin') | json }}
```

#### replace
Implementation of javascript native `replace` method, first argument can be a regex.

```twig,line-numbers
{{ "Hello World" | replace('World', 'Everyone') }}
{# -> Hello Everyone #}
```

#### reverse
Reverse a given value

```twig,line-numbers
{{ "Hello World" | reverse }}
```

#### round <span>(value, precision=0, method='common')</span>
Round the number to a given precision using defined method

```twig,line-numbers
{{ 42.55 | round }}
{# -> 43.0 #}

{{ 42.55 | round(1, 'floor') }}
{# -> 42.5 #}
```

#### slice
Slice an array into multiple sub arrays

```twig,line-numbers
{% set users = [{username:'doe'}, {username:'dim'}, {username: 'kim'}, {username: 'lap'}] %}
{% for section in users | slice(2) %}
  <ul>
    <h4> Section {{ loop.index }}</h4>
    {% for user in section %}
      <li> {{ user.username }}</li>
    {% endfor %}
  </ul>
{% endfor %}
```

#### string
Make a string unicode if it isn’t already.

#### striptags
Strip Html,XML tags from a string

```twig,line-numbers
{{ "<h2> Hello World </h2>" | striptags }}
{# -> Hello World #}
```

#### title
converts string to a title with each word first letter will be uppercase

```twig,line-numbers
{{ "hello world" | title }}
{# -> Hello World #}
```

#### trim
Javascript implementation of trim.

#### truncate
Returns a truncate copy of string.

```twig,line-numbers
{{ "Grumpy wizards make toxic brew for the evil Queen and Jack." | truncate(30) }}
{# -> Grumpy wizards make toxic brew... #}
```

#### upper
Makes entire string uppercase.

#### urlencode
Makes value url friendly (uses UTF-8 encoding).

#### wordcount
Count words in a string

#### float
Converts value to a float.

#### int
Converts value to an integer.

### Adding your own filters
If built-in filters are not enough for you, then you can consider adding your own filters using `View` provider. Ideally you can add your own custom filters anywhere you really want, but let's try to keep things organized.

Inside `boostrap/start.js` file, you can add your own custom filters

```javascript,line-numbers
const App = use('App')
const View = use('View')

App.on('after:start', function () {
  View.addFilter('date', function (value, format) {
    return moment(value).format(format)
  })
})
```

and finally you can make use of the above filter as

```twig,line-numbers
{{ new Date() | date('YYYY-MM-DD') }}
```

## Inheritance
Inheritance makes your code reusable by allowing `extending`, `including` and `importing` other templates.

### include
By including a template you share the current template scope with the template under inheritance, it is good for isolating markup to be reused under a different .html file.

```twig,line-numbers
{# resources/views/user.html #}

<h2> {{ user.username }} </h2>
<h4> {{ user.age }} </h4>
<p> {{ user.bio }} </p>
```

Now you can include above template as follows

```twig,line-numbers
{% for user in users %}
  {% include 'user' %}
{% endfor %}
```

### extends
Extending a view is little different from including a view, as after extending a view you can replace `block` inside it.

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

```twig,line-numbers
{% extends 'master' %}

{% block content %}
  This is home page
{% endblock %}
```

### import
Importing a view helps in exposing macros to be used by parent view, view under import does not have access to the scope of the parent view

```twig,line-numbers
{% macro label(text) %}
<div>
  <label>{{ text }}</label>
</div>
{% endmacro %}
```

And now you can import the above view to make use of `label macro`

```twig,line-numbers
{% import 'form' as form %}

{{ form.label('First Name') }}
{{ form.label('Last Name') }}
```

Also you can define alias from exported variable as follows

```twig,line-numbers
{% from 'form' import label as description %}

{{ description('First Name') }}
```

## Expressions

You can make use of multiple different expressions while defining your views, which includes

### Maths

* Addition : `+`
* Subtraction : `-`
* Division : `/`
* Division and integer truncation : `//`
* Division remainder : `%`
* Multiplication : `*`
* Power : `**`

```twig,line-numbers
{{ 2 + 2 }}
{{ 10 * 5 }}
{{ 10 / 2 }}
```

### Comparison

* `==`
* `!=`
* `>`
* `>=`
* `<`
* `<=`

```twig,line-numbers
{% if age > 18 %}
  You are allowed to drive
{% endif %}
```

### Logical

* `and`
* `or`
* `not`

```twig,line-numbers
{% if age > 18 and age < 60 %}
  You are allowed to drive
{% endif %}
```

### If Expression

Just like coffeescript inline expressions, you can make use of if expression as follows

```twig,line-numbers
{{ "true" if foo else "false" }}
```

also you can make use of it inside a function call

```twig,line-numbers
{{ getAge(dob if dob else "1990-10-10") }}
```

### Regular Expressions

Just like javascript you can call regular expressions inside a view

```twig,line-numbers
{{ [a-zA-Z]+ }}
```

## Auto Escaping

All outputs are auto-escaped to keep your views safe from `XSS` attacks. In case you want to skip auto-escaping, consider making use of `safe` filter.

```twig,line-numbers
{{ scriptTag | safe }}
```

## Service Injection

Service injection helps you in injecting dependencies inside your views, Which means you can make use of IOC container inside your html to resolve Models, Service and almost anything.

```twig,line-numbers
{% set UserModel = use('App/Model/User') %}
{% yield users = UserModel.all() %}

{% for user in users.toJSON()   %}
  {{ user.username }}
{% endfor %}
```

## Extending Views

You can also extend views to register your own filters and global methods to be used inside your html files. Consider adding them inside `boostrap/start.js` file.

### Adding filter

```twig,line-numbers
const App = use('App')
const View = use('View')

App.on('after:start', function () {
  View.addFilter('name', function () {
    // logic goes here
  })
})
```

### Adding global

```twig,line-numbers
const App = use('App')
const View = use('View')

App.on('after:start', function () {
  View.addGlobal('name', 'value')
})
```

{% endraw %}
