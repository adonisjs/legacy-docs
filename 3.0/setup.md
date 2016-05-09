---
title: Setup
permalink: setup
description: Adonis Environment Configuration & Setup
weight: 0
categories:
- first-steps
---

This guide will walk you through the important parts after creating a new project with Adonis.

## Environment

Every application is developed in the development environment and is deployed in production environment. 

Switching between these environments can become a daunting task since you have different configuration settings for each environment.

Adonis makes this process easier with the use of `.env` file to manage environment specific configuration. This file is saved inside the root of your project.

Following are some of the best practices to manage environment specific configuration.

1. Never commit `.env` file to your version control. For example- never push this file to Github, Bitbucket etc.
2. Create a different `.env` file on your server or automate the process of creating this file at the time of deployment.
3. Store all sensitive key/value pairs inside this file. For example- **OAuth Keys, STMP Credentials** etc.

## Loading Environment File

Adonis automatically will load the `.env` file from the root of your project. Later you can make use of the [Env Provider](env-provider) to access the defined key/values pairs.

You can also share your `.env` file between multiple projects from a global location, instead of defining it for every project.

Simply pass `ENV_PATH` to the start script and Adonis will know where to load the file from.

```bash
npm start -- --ENV_PATH=/etc/config/.env
```

## Security

Plenty of security features are built right into the framework to make sure your applications are free from common web attacks like **CSRF, CORS, XSS, Content Security Policy and much more**.

There is a separate guide on [Security](security), make sure to read it carefully and enable/disable desired features.

## Scaffolding

**Adonis Ace** is a command line utility to perform tasks from your terminal. It ships with plenty of commands to scaffold Controllers, Models, Middleware etc.

### Available Commands

```bash
./ace --help
```

Above command will show a help screen with the list of all available commands.

```
  Commands:

    repl
    deploy [options]
    make:controller [options] <name>
    make:migration [options] <name>
    make:model [options] <name>
    make:view [options] <name>
    make:command <name>
    make:hook [options] <name>
    make:middleware <name>
    make:seed <name>
    make:listener [options] <name>
    migration:run [options]
    migration:rollback [options]
    migration:refresh [options]
    migration:reset [options]
    db:seed [options]
    migration:status
    key:generate [options]
```

In order to know more about a specific command, run the following.

```bash
./ace make:controller --help
```

## Fixing Ace File

`ace` is an executable file in the root of your project. While creating a new project, Adonis will setup this file based on the OS and the path where NodeJs is installed. 

When cloning the project repo, or moving between Windows and OSX, you may end up with a non-working `ace` file. In order to fix it, just run the below command.

```bash
adonis fix ace
```

Behind the scenes, Adonis will perform following operations.

1. Setup the correct path of NodeJs on the first line of `ace` file.
2. If you are on Windows, it will create a `ace.cmd` file, which will execute the `ace` file for you.