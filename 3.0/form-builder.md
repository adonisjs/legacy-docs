---
title: Form Builder
permalink: form-builder
weight: 11
categories:
- getting-started
---

Form builder makes it so easy to create maintainable HTML forms using a special syntax without writing HTML tags.

Each application of AdonisJs ships with `form`  global, which is accessible inside all the views.

## open

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

## label(name, text, attributes)

```twig
{{ form.label('username', 'Enter Username') }}
{{ form.label('username', 'Enter Username', {class: 'label-class'}) }}
```

**Outputs**

```html
<label name="username"> Enter Username </label>
```

## text(name, value, attributes)

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

## file(name, attributes)

Create a file upload button

```twig
{{ form.file('avatar') }}
```

## textarea(name, value, attributes)

```twig
{{ form.textarea('description') }}
{{ form.textarea('description', value) }}
{{ form.textarea('description', value, {class: 'big'}) }}
```

## radio(name, value, checked, attributes)

```twig
{{ form.radio('gender', 'male') }}
{{ form.radio('gender', 'female', true) }}
```

## checkbox(name, value, checked, attributes)

```twig
{{ form.checkbox('terms', 'agree') }}
{{ form.checkbox('terms', 'agree', true) }}
```

## select(name, options, selected, emptyOption, attributes)

```twig
{{ form.select('countries', ['India', 'US', 'UK'], null, 'Select Country') }}
```

**Outputs**

```html
<select name="countries">
  <option value="">Select Country</option>
  <option value="India">India</option>
  <option value="US">US</option>  
  <option value="UK">UK</option>
</select>
```

#### With Object
```twig
{{ form.select('countries', {ind: 'India', us: 'Usa'}) }}
```

```html
<select name="countries">
  <option value="ind">India</option>
  <option value="us">US</option>  
</select>
```

#### Define selected option

```twig
{{ form.select('countries', {ind: 'India', us: 'Usa'}, 'ind') }}
```

```html
<select name="countries">
  <option value="ind" selected>India</option>
  <option value="us">US</option>  
</select>
```

#### Select multiple

```twig
{{ form.select('countries', {ind: 'India', us: 'Usa', uk: 'UK'}, ['ind', 'us'], null, {multiple: true}) }}
```

```html
<select name="countries" multiple>
  <option value="ind" selected>India</option>
  <option value="us" selected>US</option>  
  <option value="us">US</option>  
</select>
```

## selectRange(name, start, end, selected, emptyOption, attributes)

Create a select box within a given range.

```twig
{{ form.selectRange('days', 1, 30) }}
```

## submit(value, name, attributes)

```twig
{{ form.submit('Create Account', 'create') }}
```

**Outputs**

```html
<input type="submit" name="create" value="Create Account" />
```

## button(value, name, attributes)

```twig
{{ form.button('Create Account', 'create') }}
```

**Outputs**

```html
<button type="submit" name="create"> Create Account </button>
```

## resetButton(value, name, attributes)

```twig
{{ form.resetButton('Clear') }}
```
