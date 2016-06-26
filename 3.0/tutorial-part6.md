---
title: Finishing Up
permalink: adonis-blog-part6
description: Tutorial - Completing Blog engine tutorial
weight: 5
categories:
- tutorial
---

{{TOC}}

Let's finish up this tutorial by making final changes to the entire flow. Intentionally it was a simple tutorial to make to feel comfortable with the framework. You can access all the available [Cookbooks](cookbooks) to learn more about AdonisJs.

## Showing Individual Post

We have got a view to list all the blog posts. But there is no way to view a single blog post. So quickly open the routes file and register a route for same.

##### app/Http/routes.js

```javascript
Route.get('/post/:id', 'PostController.show')
```

`:id` is a dynamic segment. Which means we can pass the **post id** in the url and access it within the controller. You can read more about [Route parameters](/docs/routing#route-parameters) in the docs.

Next we need to create the view for showing a post.

```bash
./ace make:view showPost
```

Output

```bash
create: resources/views/showPost.njk
```

##### resources/views/showPost.njk

Paste the below code snippet to the showPost view.

```twig
{% extends 'master' %}

{% block content %}
  <div class="post">
    <div>
      <a href="/">  Go Back </a>
    </div>
    <hr>
    <h2>{{ post.title }}</h2>
    <p>{{ post.content }}</p>
  </div>
{% endblock %}
```

Finally, we need the `PostController.show` method to fetch the post from the database and send to it view.

##### app/Http/Controllers/PostController.js

```javascript
class PostController {

  * show (request, response) {
    const post = yield Post.find(request.param('id'))
    yield response.sendView('showPost', { post: post.toJSON() })
  }

}
```

This time we make use of `find` method to fetch the post for a given id and finally we send the `json` representation of the post to the view.

We are not done yet. Let's open the `home.njk` view and add the link to the individual post.

##### resources/views/home.njk

```twig
<h2><a href="post/{{ post.id }}"> {{ post.title }} </a></h2>
```

Now refresh the browser and click on the individual posts to view a specific post.

![](http://i.imgbox.com/z52WwfmM.png)

## Link To Add A New Post

So far we have been visiting `post/create` route manually in order to create a new post. Let's add a link on the home page.

##### resources/views/home.njk

Paste the below code snippet just before the `posts-wrapper` div.

```twig
<div>
  <p>
    Below is the list of all the awesome posts created by all of us. You can also
    contribute by clicking the below button.
  </p>
  <a href="post/create" class="btn btn-success btn-block"> Create New Post </a>
  <hr>
</div>
```

Now, we have a shiny big button linked to the post create route.

![](http://i.imgbox.com/RqMkJilV.png)

## Ordering Posts

Another thing we should fix is to list the posts in `desc` order, so that the recent post always shows on the top.

##### app/Http/Controllers/PostController.js

Here we will modify the query and will add a `orderBy` clause.

```javascript
class PostController {

  * index (request, response) {
    const posts = yield Post.query().orderBy('id', 'desc').fetch()
    yield response.sendView('home', { posts: posts.toJSON() })
  }

}
```

Now refresh the page and you will find the most recent post on the top instead of bottom.

## Summary

In the series of these tutorials, we learned a lot about the framework and tools offered by it. This is just the beginning, checkout the documentation and cookbooks to explore new and expressive ways of writing maintainable code.

Make sure to follow us on [Twitter](https://twitter.com/adonisframework) and star the project on [Github](https://github.com/adonisjs/adonis-framework).