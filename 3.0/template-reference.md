---
title: Template Reference
permalink: template-reference
weight: 10
categories:
- getting-started
---

This is a reference guide to all available tags, filters and methods available to be used inside your views. Read [views](views) guide to understand how views work in AdonisJs.

## Tags

Tags are blocks which defines a logic operation inside your views. Below is the list of available tags and their usages.

#### if

```twig
{% if username %}
  {{username}}
{% endif %}
```

You can also perform `==` operation.

```twig
{% if age == 18 %}
  Your are allowed to join
{% endif %}
```


#### else, elif

```twig
{% if hungry %}
  I am hungry
{% elif tired %}
  I am tired
{% else %}
  I am good!
{% endif %}
```

#### If Expression

```twig
{{ 'Party' if weekend else 'Do some work' }}
```

#### for

`for` loop can iterate over both arrays and objects.

```twig
{% for item in items %}
  {{ item.text }}
{% endfor %}
```

You can also iterate over objects.

```twig
{#
  var scores = {
    Maths: 88,
    English: 92,
    Science: 94
  }
#}

{% for subject, score in scores %}
	You scored {{ score }} in {{ subject }}
{% endfor %}
```

#### set

Define a value and assign to a variable inside your views.

```twig
{% set username = "John" %}
{{ username }}
```

You can also define multiple keys and their values at once.

```twig
{% set x, y, z = 5 %}
```


#### yield

Call a ES2015 Generator or a Promise inside your views.

```twig
{% yield users = User.all() %}
{{ users | json }} 
```

#### raw

When building Front-End agnostic web apps, you are likely going to make use of `VueJs`, `AngularJs` or any similar framework. 

In order to stop your views from parsing your front-end templates, you can make use of `raw` tag.

```twig
{% raw %}
  Everything inside raw will be ignored.
{% endraw %}
```

#### filter

Instead of using filters with a `pipe (|)` symbol, you can also make use of filters as a tag.

```twig
{% filter title %}
  may the force be with you
{% endfilter %}
```

Will output

```html
May The Force Be With You
```

#### call

`call` tag is super helpful when trying to create macros that accepts a dynamic body.

Let's create a modal macro

##### resources/views/macros/modal.nunjucks
```twig
{% macro modal(effect='fade') %}
  <div class="modal {{ effect }}">
    <div class="modal-dialog">
    {{ caller() }}
    </div>
  </div>
{% endmacro %}
```

Now you can make use of the above macro as.

##### resources/views/home.nunjucks

```twig
{% from 'macros.modal' import modal %}

{% call modal() %}
  <div class="modal-header"></div>
  <div class="modal-body"></div>
  <div class="modal-footer"></div>
{% endcall %}
```

**Outputs**

```html
<div class="modal fade">
  <div class="modal-dialog">
    <div class="modal-header"></div>
    <div class="modal-body"></div>
    <div class="modal-footer"></div>
  </div>
</div>
```

## Comments

```twig
{# This is a comment #}
```

## Whitespace Control

Template engine will render all the white spaces between your tags. Use the following way you want to remove all the white between the start and end of the tag.

```twig
{% for i in [1,2,3,4,5] -%}
  {{ i }}
{%- endfor %}
```

`-` Symbol controls the whitespace.

## Expressions

All common expressions are allowed inside your  views.

- Strings: `"How are you?", 'How are you?'`
- Numbers: `40, 30.123`
- Arrays: `[1, 2, "array"]`
- Objects: `{username: 'John', age: 28}`
- Boolean: `true, false`.

## Mathematical Operators

Below is the list of mathematical operators supported by your views.

- Addition: `+`
- Subtraction: `-`
- Division: `/`
- Division and integer truncation: `//`
- Division remainder: `%`
- Multiplication: `*`
- Power: `**`

#### Usage

```twig
{{ 10 + 2 }} {# 12 #}
{{ 10 / 2 }} {# 5 #}
{{ 10 % 2 }} {# 0 #}
```

## Comparison Operators

All common comparison operators are supported.

- `==`
- `!=`
- `>`
- `>=`
- `<`
- `<=`

## Logical Operators

Below is the list of supported shorthand logical operators.

- `and`
- `or`
- `not`

```twig
{% if isLimit and count > limit %} 
  You have crossed the limit of {{ limit }} users.
{% endif %}
```

```twig
{% if isAdmin or hasPermission %}
  Welcome!
{% endif %}
```

```twig
{% if not isAdmin %}
  You are not allowed to access this record.
{% endif %}
```

## Function Calls

```twig
{{ old('name') }}
```

## Auto Escaping

All values are auto escaped inside your views to keep them safe from HTML injection.

Which means if you will pass custom HTML inside a variable it will be escaped.

```twig
{# title = <h1> Title </h1> #}

{{ title }} {# outputs &lt;h1&gt; Title &lt;/h1&gt; #}
```

You need to make use of `safe` filter to mark HTML strings to be trusted.

```twig
{{ title | safe }} {# outputs <h1> Title </h1> #}
```

## Globals

AdonisJs has bunch of pre-defined globals. Checkout [Defining Globals](views#defining-globals) to know how to define your own globals.

#### linkTo

Returns link to a given route

```javascript
Route
	.get('/users', 'UserController.index')
	.as('listUsers')
```

```twig
{{ linkTo('listUsers', 'View All Users') }}
{{ linkTo('listUsers', 'View All Users', {}, '_blank') }}

{# returns #}
<a href="/users"> View Profile </a>
<a href="/users" target="_blank"> View Profile </a>
```

#### linkToAction

Returns link for a given Route controller action.

```twig
{{ linkToAction('UserController.index', 'View All Users') }}
{{ linkToAction('UserController.index', 'View All Users', {}, '_blank') }}

{# returns #}
<a href="/users"> View Profile </a>
<a href="/users" target="_blank"> View Profile </a>
```


## Filters

Below is the list of all the available filters. Checkout [Defining Filters](views#defining-filters) for defining your own filters.

#### abs

```twig
{{ age | abs }}
```


#### action

Returns url for a given action.

```javascript
Route
	.put('user/:id', 'UserController.update')
```

```twig
<form method="POST" action="{{ 'UserController.update' | action({id: 1}) }}">
</form>
```

#### batch

Returns batches of an object inside a loop. It is helpful when printing HTML grid.

```twig
{% for row in items | batch(3) %}
  <div class='row'>
    {% for item in row %}
      <div class='col-md-4'></div>
    {% endfor %}
  </div>
{% endfor %}
```

#### capitalize

```twig
{{ name | capitalize }}
```

#### default

```twig
{{ title | default('Adonis') }}
```

#### first

Returns first item from an array.
```twig
{{ ['foo','bar'] | first }}
```

#### groupby

```twig
{# users = [{username:'doe',age:22},{username:'dim',age:22},{username:'dock',age:21}] #}

{{ users | groupby('age') | json }}
```

#### indent(width=2, firstLine=false)

Indent each line inside a string with given spaces.

```twig
{{ text | indent(2, true) }}
```

#### join

```twig
{{ ['hello', 'world'] | join(' ') }}
```

#### json(indentation=2)

```twig
{{ users | json }}
{{ users | json 4 }} 
```

#### last

Returns last item from an array.

```twig
{{ ['foo','bar'] | last }}
```

#### length

Returns length of an array.

```twig
{{ ['foo','bar'] | length }}
```

#### list

Converts an array into a list, think of it as replacement to `join`, but it also works with strings inside the array.

```twig
{{ ['foo','bar'] | list }}
```

#### lower

Converts value to lowercase

```twig
{{ "Hello World" | lower }}
{# hello world #}
```

#### random

Returns random item from an array

```twig
{{ ['foo', 'bar', 'baz'] | random }}
```

#### rejectattr

Filters an array and remove objects containing defined attributes

```twig
{# users = 
	[
		{username: 'doe', admin: false},
		{username: 'doe', admin: true}
	] 
#}
{{ users | rejectattr('admin') | json }}
```

#### replace

Implementation of javascript native `replace` method, first argument can be a regex.

```twig
{{ 'Hello World' | replace('World', 'Everyone') }}
{# Hello Everyone #}
```

#### reverse

```twig
{{ 'Hello World' | reverse }}
```

#### round

Round the number to a given precision using defined method

```twig
{{ 42.55 | round }}
{# 43.0 #}

{{ 42.55 | round(1, 'floor') }}
{# 42.5 #}
```

#### route

Returns the url for a given route.

```javascript
Route
	.put('/profile/:id', 'ProfileController.update')
	.as('updateProfile')
```

```twig
<form method="POST" action="{{ 'updateProfile' | route({id: 1}) }}">
</form>
```

#### striptags

Strip Html,XML tags from a string

```twig
{{ '<h2> Hello World </h2>' | striptags }}
{# Hello World #}
```

#### title

```twig
{{ "hello world" | title }}
{# Hello World #}
```

#### trim

Trims white space.

```twig
{{ " Hello World " | trim }}
{# Hello World #}
```

#### truncate

Returns a truncate copy of string.

```twig
{{ "Grumpy wizards make toxic brew for the evil Queen and Jack." | truncate(30) }}

{# Grumpy wizards make toxic brew... #}
```

#### upper

Makes string uppercase.

```twig
{{ 'hello world' | upper }}
```


#### urlencode

Makes value url friendly (uses UTF-8 encoding).

#### wordcount
Count words in a string

#### float
Converts value to a float.

#### int
Converts value to an integer.

## Form Builder

Form builder makes it so easy to create maintainable HTML forms using a special syntax without writing HTML tags.

Each application of AdonisJs ships with `form`  global, which is accessible inside all the views.

#### open

```twig
{{ form.open({action: 'UserController.update', params: {id: 1} }) }}

{{ form.close() }}
```

**Outputs**

```html
<form method="POST" action="/user/1?_method=PUT">
	
</form>
```

You can also bind routes and plain urls inside the `open` method.

```twig
{{ form.open({route: 'user.update'}, params: {id: 1} ) }}
{{ form.open({url: '/user/1', method: 'PUT'}) }}
```

Both will have the same output as the above one.

#### label(name, text, attributes)

```twig
{{ form.label('username', 'Enter Username') }}
{{ form.label('username', 'Enter Username', {class: 'label-class'}) }}
```

**Outputs**

```html
<label name="username"> Enter Username </label>
```

#### text(name, value, attributes)

```twig
{{ form.text('username') }}
{{ form.text('username', 'John', {class: 'input'}) }}
```

**Outputs**

```html
<input type="text" name="username" value="John" class="input" />
```

Just like text you can create all given input types.

| Input type | method |
|------------|--------|
| password | form.password() |
| email | form.email() |
| color | form.color() |
| date | form.date() |
| url | form.url() |
| search | form.search() |
| hidden | form.hidden() |

#### file(name, attributes)

Create a file upload button

```twig
{{ form.file('avatar') }}
```

#### textarea(name, value, attributes)

```twig
{{ form.textarea('description') }}
{{ form.textarea('description', value) }}
{{ form.textarea('description', value, {class: 'big'}) }}
```

#### radio(name, value, checked, attributes)

```twig
{{ form.radio('gender', 'male') }}
{{ form.radio('gender', 'female', true) }}
```

#### checkbox(name, value, checked, attributes)

```twig
{{ form.checkbox('terms', 'agree') }}
{{ form.checkbox('terms', 'agree', true) }}
```

#### select(name, options, selected, emptyOption, attributes)

```twig
{{ form.select('country', ['India', 'US', 'UK'], null, 'Select Country') }}
```

**Outputs**

```html
<select name="country">
  <option value="">Select Country</option>
  <option value="India">India</option>
  <option value="US">US</option>  
  <option value="UK">UK</option>
</select>
```