---
title: Creating Blog Posts
permalink: adonis-blog-part5
description: Tutorial - Creating blog posts using AdonisJs
weight: 4
categories:
- tutorial
---

{{TOC}}

In the [last tutorial](adonis-blog-part4) we displayed the list of blog posts by fetching them from the database. Now let's move one step ahead and add the functionality of creating posts.

This time, we are going to explore a lot of exciting features of AdonisJs from the Form Builder to the expressive [Validator](validator).

## Creating Routes and Views

Quickly register a couple of new routes inside the routes file.

##### app/Http/routes.js

```javascript
Route.get('/post/create', 'PostController.create')
Route.post('/post', 'PostController.store')
```

We registered two routes, one is to show the form to create the post and the other one is to handle the `POST` data of the submitted form.

##### app/Http/Controllers/PostController.js

Let's create the `create` and `store` methods on the existing PostController.

```javascript
class PostController {

  * create (request, response) {
      yield response.sendView('createPost')
  }

  * store (request, response) {
    // Come here later
  }

}

module.exports = PostController
```

Finally, we need to create the view using `ace`.

```bash
./ace make:view createPost
```

Output

```bash
create: resources/views/createPost.njk
```

## Form Builder

We will make use of Form Builder to set up the form for creating a new post.

##### resources/views/createPost.njk

```twig
{% extends 'master' %}

{% block content %}
  {{ form.open({action: 'PostController.store'}) }}

    {{ csrfField }}

    <fieldset class="form-group">
      {{ form.label('Post Title') }}
      {{ form.text('title', null, { class: 'form-control' }) }}
    </fieldset>

    <fieldset class="form-group">
      {{ form.label('Description') }}
      {{ form.textarea('content', null, { class: 'form-control' }) }}
    </fieldset>

    {{ form.submit('Publish', 'publish', { class: 'btn btn-primary btn-block' }) }}

  {{ form.close() }}
{% endblock %}
```

Quite a lot to cover here. Form builder provides some convenient methods to create HTML forms.

1. `form.open` creates the form tag. Here we make use of `action` property to define the controller method for handling the POST request. Form `action` and the `method` will be filled automatically for you.
2. All of the forms are protected by [CSRF](https://www.owasp.org/index.php/Cross-Site_Request_Forgery) protection. So we need to set the `csrfField` to make sure we are able to submit forms without any restrictions.
3. Everything else is a part of standard **Form Builder** API to create the input fields and the submit button.

Visit [http://localhost:3333/post/create](http://localhost:3333/post/create) and you will see a nice looking form to create the posts.

![](http://res.cloudinary.com/adonisjs/image/upload/v1472841279/create-posts_xgghpo.png)

## Validating Form Inputs

Validating user input is so important as you can never trust the data provided to you. AdonisJs got a beautiful validator to make this task a lot easier for you.

[Validator](/docs/validator) is not part of the base installation, which means we need to pull it off from the npm.

```bash
npm i --save adonis-validation-provider
```

Next, we need to register the provider and create an alias. Don't worry if you do not understand the providers completely, it is not something you are supposed to know from day 1.

##### boostrap/app.js

```javascript
const providers = [
  ...,
  'adonis-validation-provider/providers/ValidatorProvider'
]
```

and then setup an alias

```javascript
const aliases = {
  ...,
  Validator: 'Adonis/Addons/Validator'
}
```

That's all required on the setup front. Now we are going to validate the form input inside `PostController`.

```javascript
const Validator = use('Validator')

class PostController {

  * store (request, response) {
    const postData = request.only('title', 'content')

    const rules = {
      title: 'required',
      content: 'required'
    }

    const validation = yield Validator.validate(postData, rules)

    if (validation.fails()) {
      yield request
          .withOnly('title', 'content')
          .andWith({ errors: validation.messages() })
          .flash()
      response.redirect('back')
      return
    }

    yield Post.create(postData)
    response.redirect('/')
  }


}

module.exports = PostController
```

Let's break down the `store` method into multiple chunks and discuss the each piece of code.

1. `request.only` returns an object of key/values for the specified key names.
2. Next, we define a `rules` object to validate the form input using `Validator.validate` method.
3. If `validation.fails()`, we send the user input back with all the error message inside flash messages. There is a complete guide of [Flash Messages](sessions#flash-messages).
4. If validation passes, we will create the post and will redirect the user back to the `home` view.

Next, we need make some modifications inside our `createPost` view to show the errors returned back as flash messages.

##### resources/views/createPost.njk

Enter the below piece of code just before the `form.open` tag.
```twig
{% if old('errors') %}
  <div class="alert alert-danger">
    {% for error in old('errors') %}
      <li> {{ error.message }} </li>
    {% endfor %}
  </div>
{% endif %}
```

`old` is a method to fetch value for a given key from flash messages. Here we need to pull the `errors` key to get the errors sent from the Controller.

Also, it is a good practice to re-fill the user input after redirection so that they won't have to re-type the previously entered information. For that, we are going to modify the input field and the text-area.

##### resources/views/createPost.njk
```twig
{{ form.text('title', old('title'), { class: 'form-control' }) }}

{# and #}
{{ form.textarea('content', old('content'), { class: 'form-control' }) }}
```

Notice carefully, we are making use of the `old` method to fetch the **title** and the **content** and set it as the value for input.

Let's refresh the page and try to create a new post with empty title and content.

![](http://res.cloudinary.com/adonisjs/image/upload/v1472841283/validation-failed_dz2d79.png)

Wow, this is fun. We have got a working form with super easy validation and in-place error handling.
