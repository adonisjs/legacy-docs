---
title: Database Models
permalink: adonis-blog-part3
description: Tutorial - SQL Database Models in AdonisJs
weight: 2
categories:
- tutorial
---

{{TOC}}

So far we have covered the basics of setting up a new AdonisJs application by creating Routes, Controllers and rendering Views. In this tutorial, we will take a step further by learning about **Database Models**.

AdonisJs supports a majority of SQL databases. Here is a complete guide on [Database Setup](database-setup). We will start by creating migrations and Data models which are also known as `Lucid` models.

## What is a Database Model

Each Database model represents a single `SQL` table inside your database. For example:

|Model | Database Table|
|------|---------------|
| User | users |
| Post | posts |
| Category | categories


Hope it makes sense. Now in order to interact with posts, we need two things.

1. A `Post` Model.
2. And a `posts` database table.

## Creating Database Model

Models live inside a dedicated directory called `app/Model`. Let's make use of `ace` to create a `Post` model.

```bash
./ace make:model Post
```

Output

```bash
create: app/Model/Post.js
```

##### app/Model/Post.js

```javascript
'use strict'

const Lucid = use('Lucid')

class Post extends Lucid {

}

module.exports = Post
```

Each model is a dedicated `ES2015` class just like our Controllers, but each model will extend `Lucid` to make it different from an ordinary class.

You never have to touch your models in most cases. So we will leave this file as it is and switch to another task.

## What are Migrations ?

Our next step is to choose a database we want to work with and create the necessary database tables. For the sake of simplicity, we will stick to `SQLite`. However, you are free to use **MYSQL** or **PostgreSQL**. 

Now migration is a process of creating database tables using the Javascript code. Migrations have lots of benefits as compared to the standard workflow of creating database tables using **SequelPro**, **Workbench**, etc. There is a complete guide on [Migrations](migrations) that you can reference.

## Creating Migrations

As always `ace` (our buddy) is going to create a migration for us.

```bash
./ace make:migration posts --create=posts
```

Output

```bash
create: database/migrations/1464075245386_posts.js
```

Quickly open this file and explore the options to create database table without touching the SQL interface.

##### database/migrations/1464075245386_posts.js

```javascript
'use strict'

const Schema = use('Schema')

class PostSchema extends Schema {

  up () {
    this.create('posts', (table) => {
      table.increments()
      table.string('title')
      table.text('content')
      table.timestamps()
    })
  }

  down () {
    this.drop('posts')
  }

}

module.exports = PostSchema
```

Wow! It is so simple to define a database table within your standard Js files. Each migration file has two predefined methods called `up` and `down.`.

1. `up` method is used to create a table, or add new fields to the existing table, etc.
2. `down` is always opposite of `up`. It is used when you want to undo the changes you just made, also known as **rollback**.

## Configuring SQLite

Finally, we need to run this migration in order to execute SQL query and create the database table called `posts`. Before that, we need to make sure that SQLite is setup properly.

##### .env

`.env` file contains the current database connection your application will use. By default, it is configured to make use of **SQLite** so we are good to go.

```env
HOST=localhost
PORT=3333
APP_KEY=z8L7RMdVBTpJEpfxSh3NVUfL563N3fxJ
NODE_ENV=development
CACHE_VIEWS=false
SESSION_DRIVER=cookie

# Database Connection
DB_CONNECTION=sqlite

DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_DATABASE=adonis
```

But we need to install the `sqlite3` driver from **npm**.

```bash
npm i --save sqlite3
```

Once the installation is done, execute the below command to create the `posts` table.

```bash
./ace migration:run
```

Output

```bash
✔ Database migrated successfully.
```

We covered a lot in this tutorial, especially if you are new to the concepts we talked about. That's the thing about frameworks, you need to spend initial days to get a solid grasp of available tools and options to make your development cycle a lot easier in future.