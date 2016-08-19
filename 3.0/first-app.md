---
title: First Application
description: Writing first Adonis application
permalink: first-adonis-app
---

{{TOC}}

## Guide Assumptions

This guide assumes that you have basic understanding of MVC and AdonisJs. If not, please checkout this [Overview](overview) guide.

You will be learning a lot of new concepts and good practices to write maintainable and expressive web applications. 

Most likely you will feel over whelming for the first time, but just stick around and slowly everything will start making sense.

## Creating New Adonis Project

Make sure you have installed NodeJs version `>= 4` with npm `>=3`. The installation process for Adonis is  very simple and it just works.

In order to create new projects, you must have the `adonis-cli` module installed globally on your machine.

### Install Adonis Cli

```bash
npm i -g adonis-cli
```

### Create New Project

```bash
adonis new blog --dev
```

[notification type=info]
`--dev` flag is to create a project with latest dev release. You will not need this flag once 3.0 is released.
[/notification]

### Hello World

Once you are done creating the new project, `cd` into it to start the server.

```bash
cd blog
npm run dev
```

Above command will start the server on `http://localhost:3333`. Here **3333** is the port on which your application is running. Edit `.env` file and change the `PORT` number to the one you need.

Open [http://localhost:3333](http://localhost:3333) in the browser to see the welcome page.

![](https://i.imgsafe.org/4fa303f.png)

Congratulations! You have created your first **Hello World** application. If you have faced any issues following the above process, report it on [Github](https://github.com/adonisjs/adonis-app/issues).

### Directory Structure

Every Adonis application comes with a pre-defined structure. Each entity has been given a separate directory to keep the code organised.

| File/Folder | Purpose|
|--------------|---------|
| ace | `ace` is a node executable file to run terminal commands.
| app | This folder stores all the meat of your application. Model,Controllers, routes all are stored inside this directory.|
| bootstrap | It contains the code to setup and start the node HTTP Server. The only files you will ever have to touch in this directory is `app.js` and `events.js`.|
|config | This directory is dedicated to store the configuration of your application. You can also create your own config files inside this directory.|
|database | database stores the migrations,seeds and factories to manage database initial state. You will always use this directory to set up your app initial state.|
|providers| To store application specific providers, not something you should worry about for now.|
|public | Public directory is dedicated to serve static resources. For example - Images, Css and Js Files etc.|
|resources | This directory keeps your `nunjucks` views inside a sub-directory. Also you can store `sass`, `less` files here, later compile them to css and save the output inside `public` directory.|
|server.js| Starts the http server.
|storage| You can store almost anything inside this directory, for example application logs, tmp files etc.


## Setting Up A Blog

Let's begin the Journey to create a working blog application. Code for this blog is available on [Github](http://github.com/thetutlage/adonis-blog) and you can see the final output [here](http://demo.adonisjs.com/blog).

We will keep it simple to make sure there is not much to digest for newbie's.

### Creating Routes

[Routes](/docs/routing) are the urls to your application. Let's start by defining the routes required to setup our blog.

##### app/Http/routes.js

```javascript
const Route = use('Route')

Route.resource('articles', 'ArticlesController')
```

A `resource` will define 7 conventional routes to be used in order to manage our articles. Isn't it nice? Instead of writing 7 lines of code, you just write one line of code.

Below routes are registered automatically for you using the `resource` keyword.

| Route | Http Verb | Controller Action|
|-------|-----------|------------------|
/articles   |   GET   |    ArticlesController.index
/articles/create   |   GET   |    ArticlesController.create
/articles   |   POST   |    ArticlesController.store
/articles/:id   |   GET   |    ArticlesController.show
/articles/:id/edit   |   GET   |    ArticlesController.edit
/articles/:id   |   PUT   |    ArticlesController.update
/articles/:id   |   DELETE   |    ArticlesController.destroy

### Binding Controller

Now as we have our routes setup, let's create the `ArticlesController`.


Copy and paste the following to the command line.

```bash
./ace make:controller Articles --resource
# on windows
ace make:controller Articles --resource
```

##### Output

```bash
create: app/Http/Controllers/ArticlesController.js
```

[notification type=info]
`ace` is a command line tool to run commands on terminal. We will learn more about ace in the upcoming guides.
[/notification]

Great! ArticlesController has been saved inside **app/Http/Controllers** directory. Let's open up this file and write some code.

##### app/Http/Controllers/ArticlesController.js

```javascript
'use strict'

class ArticlesController {

  * index(request, response) {
	  yield response.sendView('articles.list')
  }

}

module.exports = ArticlesController
```

Inside the `index` method, we are sending a view called `articles.list`. Let's create this view using ace again.

But first, let's clean the existing views to make sure we are starting fresh.

```bash
rm resources/views/*.nunjucks
```

and create the view now.

```bash
./ace make:view articles/list
# on windows
ace make:view articles/list
```


Re-run the server again using the below command. Make sure to keep it running and open a new terminal to execute ace commands.

```bash
npm run dev
```

Now open up [http://localhost:3333/articles](http://localhost:3333/articles) and you will see the below message inside your browser.

![](https://i.imgsafe.org/0114571.png)