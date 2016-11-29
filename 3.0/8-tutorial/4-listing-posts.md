---
title: Listing Blog Posts
permalink: adonis-blog-part4
description: Tutorial - Listing blog posts using AdonisJs
weight: 3
categories:
- tutorial
---

{{TOC}}

In this tutorial, we will continue the topic of [Database Models](adonis-blog-part3) by using them inside `PostController`. Make sure your server is up and running on [http://localhost:3333](http://localhost:3333).

## Fetching Blog Posts

Quickly open the `PostController` and paste the following snippet into it.

##### app/Http/Controllers/PostController.js
```javascript
'use strict'

const Post = use('App/Model/Post')

class PostController {

  * index (request, response) {
    const posts = yield Post.all()
    yield response.sendView('home', { posts: posts.toJSON() })
  }

}

module.exports = PostController
```

We have made few changes to the existing controller file. 

1. On **line, no 3** we include the model so that we can make use of it.
2. Next inside the `index` method, we fetch all posts by calling the `all` method on the Post model.
3. Finally, we send the JSON representation of posts to our `home` view.

Now open the `home` view and let's see how can we list the posts as HTML.

##### resources/views/home.njk

Replace everything inside your view with the below code snippet.

```twig
{% extends 'master' %}

{% block content %}
  <div class="posts-wrapper">
    {% for post in posts %}
      <div class="post">
        <h2><a href=""> {{ post.title }} </a></h2>
        <p> {{ post.content }} </p>
      </div>
    {% endfor %}
  </div>
{% endblock %}
```

Here we are going to loop through all the `posts` using the `for` loop and show the **title** and **content** for each post.

If you will refresh the page, you will see nothing on the screen since there are no **posts** inside our database. Before we add them, let's show a message on the web page if there are no posts.

##### resources/views/home.njk

Just before the `{% endfor %}` tag add the below snippet.

```twig
{% else %}
  <h2> No posts found </h2>
```

So it will be 

```twig
{% for post in posts %}
    .....
{% else %}
  <h2> No posts found </h2>
{% endfor %}
```

Now when you will refresh the page. You will get the message **No posts found**.

## Seeds And Factories

Before we implement the logic of adding new posts, we need some dummy data to work with. You can create new `posts` by running SQL queries inside your database interface, but that will defeat the whole purpose of rapid development and re-usability.

There are plenty of use cases for **Database Factories** and **Seeds**, but for now we will use them to create some dummy blog posts.

##### database/factory.js

Let's paste the below code snippet inside the factory file.

```javascript
const Factory = use('Factory')

Factory.blueprint('App/Model/Post', (fake) => {
  return {
    title: fake.sentence(),
    content: fake.paragraph()
  }
})
```

Factories let you define blueprints for your models. Each blueprint takes the model name as the first parameter and a callback as the second parameter.

Callback get's access to the [chancejs](http://chancejs.com/) instance, which is used to generate random data.

Next, we need to create a seed file, which will make use of above blueprint to create posts.

```bash
./ace make:seed Post
```

Output

```bash
create: database/seeds/Post.js
```

##### database/seeds/Post.js

```javascript
'use strict'

const Factory = use('Factory')

class PostSeeder {

  * run () {
    yield Factory.model('App/Model/Post').create(5)
  }

}

module.exports = PostSeeder
```

Inside the `seed` file we fetch the model blueprint using `Factory.model` and create **5** posts.

Finally, we need to seed this file by running an `ace` command.

```bash
./ace db:seed
```

Output

```bash
✔ seeded database successfully
```

Now refresh the browser and you will see all the newly created posts. At last, we are going to make some enhancements to the posts list.

##### resources/views/home.njk

Here we add the `truncate` filter to the post content by limit the characters count to 150.

```twig
{{ post.content | truncate(150) }}
```


##### public/style.css

Add some margin/padding to the post div.

```css
.post {
  margin-top: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e8e8e8;
}
```

This is how it looks now.

![](http://i.imgbox.com/9bcfrHmB.png)