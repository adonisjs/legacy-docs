---
title: Form Builder
permalink: form-builder
weight: 2
categories:
- general-topics
---

{{TOC}}

HTML forms can be created using the standard HTML tags, or you can make use of **Form Builder** to write forms for you. Behind the scenes form builder will output the HTML only, but it has several benefits over writing HTML manually.

## Overview

With the help of form builder, you can bind your form actions to a route or a controller directly, instead of manually writing the `action` and `method` attributes.

Binding actions makes it easier to make changes within the routes file without touching your views, since the form builder has a reference to the route name.


## Using Form Builder

You can make use of the form builder with the help of a global `form` within your views.

```twig
{{ form.open({action: 'UserController.update', params: {id: 1} }) }}
  
  {{ form.label('Username') }}
  {{ form.text('username') }}

{{ form.close() }}
```

<div class="note">
  You are also free to use plain HTML within `open` and `close` tags.
</div>

You can also bind routes and plain urls inside the `open` method.

```twig
{{ form.open({route: 'user.update'}, params: {id: 1} ) }}
{{ form.open({url: '/user/1', method: 'PUT'}) }}
```

Both will have the same output as the above one.

#### uploading files

Uploading files requires a special `enctype` attribute on the form tag, which can be added using the `files` flag.

```twig
{{ form.open({action: 'UserController.store', files: true}) }}
{{ form.close() }}
```

## Methods

Below is the list of available methods on the builder instance.

#### label(name, [value], [attributes])

```twig
{{ form.label('username', 'Enter Username') }}
{{ form.label('username', 'Enter Username', {class: 'label-class'}) }}
```

#### text(name, [value], [attributes])

```twig
{{ form.text('username') }}
{{ form.text('username', 'John', {class: 'input'}) }}
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

#### file(name, [attributes])

Create a file upload button

<div class="note">
  <strong>Note:</strong> Make sure to use `files` flag on the `form.open` method.
</div>

```twig
{{ form.file('avatar') }}
```

#### textarea(name, [value], [attributes])

```twig
{{ form.textarea('description') }}
{{ form.textarea('description', value) }}
{{ form.textarea('description', value, {class: 'big'}) }}
```

#### radio(name, [value], [checked=false], [attributes])

```twig
{{ form.radio('gender', 'male') }}
{{ form.radio('gender', 'female', true) }}
```

#### checkbox(name, [value], [checked=false], [attributes])

```twig
{{ form.checkbox('terms', 'agree') }}
{{ form.checkbox('terms', 'agree', true) }}
```

#### select(name, options, [selected], [emptyOption], [attributes])

```twig
{{ form.select('countries', ['India', 'US', 'UK'], null, 'Select Country') }}
```

```html
<select name="countries">
  <option value="">Select Country</option>
  <option value="India">India</option>
  <option value="US">US</option>  
  <option value="UK">UK</option>
</select>
```

Or you can pass options as an object.

```twig
{{ form.select('countries', {ind: 'India', us: 'Us', fr: 'France'}, ['ind']) }}
```

```html
<select name="countries">
  <option value="ind" selected>India</option>
  <option value="us">US</option>  
  <option value="free">France</option>  
</select>
```

##### Select multiple

```twig
{{ form.select('countries', {ind: 'India', us: 'Usa', uk: 'UK'}, ['ind', 'us'], null, { multiple: true }) }}
```

```html
<select name="countries" multiple>
  <option value="ind" selected>India</option>
  <option value="us" selected>US</option>  
  <option value="uk">UK</option>  
</select>
```

#### selectRange

Create a select box with multiple options inside the define range.

```twig
{{ form.selectRange('days', 1, 30) }}
```

#### submit

```twig
{{ form.submit('Create Account', 'create') }}
```

#### button

```twig
{{ form.button('Create Account', 'create') }}
```

#### resetButton

```twig
{{ form.resetButton('Clear') }}
```
