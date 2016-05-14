---
title: Form Builder
permalink: form-builder
weight: 11
categories:
- getting-started
---

Each application of AdonisJs ships with `form` global available to all of your views. It is an instance of Form builder to make it easier to create HTML forms by referencing Routes and Controller methods.

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

## label

```twig
{{ form.label('username', 'Enter Username') }}
{{ form.label('username', 'Enter Username', {class: 'label-class'}) }}
```

##### Outputs

```html
<label name="username"> Enter Username </label>
```

## text

```twig
{{ form.text('username') }}
{{ form.text('username', 'John', {class: 'input'}) }}
```

##### Outputs

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

## file

Create a file upload button

```twig
{{ form.file('avatar') }}
```

## textarea

```twig
{{ form.textarea('description') }}
{{ form.textarea('description', value) }}
{{ form.textarea('description', value, {class: 'big'}) }}
```

## radio

```twig
{{ form.radio('gender', 'male') }}
{{ form.radio('gender', 'female', true) }}
```

## checkbox

```twig
{{ form.checkbox('terms', 'agree') }}
{{ form.checkbox('terms', 'agree', true) }}
```

## select

```twig
{{ form.select('countries', ['India', 'US', 'UK'], null, 'Select Country') }}
```

##### Outputs

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

## selectRange

Create a select box within a given range.

```twig
{{ form.selectRange('days', 1, 30) }}
```

## submit

```twig
{{ form.submit('Create Account', 'create') }}
```

##### Outputs

```html
<input type="submit" name="create" value="Create Account" />
```

## button

```twig
{{ form.button('Create Account', 'create') }}
```

##### Outputs

```html
<button type="submit" name="create"> Create Account </button>
```

## resetButton

```twig
{{ form.resetButton('Clear') }}
```
