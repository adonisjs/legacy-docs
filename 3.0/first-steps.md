---
title: First Steps
permalink: first-steps
weight: 2
categories:
	- getting-started
---

{{TOC}}

This guide will walk you through the important parts of setting up a new project with Adonis.

## Environment

Every application is developed in development environment and is deployed is production environment. 

Switching between these environments can become a daunting task, since you have different configuration settings for each environment.

Adonis makes the use of `.env` files, saved inside the root of your project. Following are the some best practices to manage environment specific configuration.

1. Never commit `.env` file to your version control. For example - never push this file to Github, Bitbucket etc.
2. Create a different `.env` file on your server or automate the process of creating this file at the time of deployment.
3. Store all sensitive key/value pairs inside this file. For example - OAuth Keys, STMP Credentials etc.

### Loading Environment File

Adonis automatically will load the `.env` file from the root of your project.

But that may not be the case when you have common configuration settings your multiple projects and you want to load `.env` from a global location.

Simply pass `ENV_PATH` to the start script and Adonis will know where to load the file from.

```bash
npm start -- --ENV_PATH=/etc/config/.env
```

## Security

Handful of security features are built right into the framework to make sure you applications are free from common web attacks like **CSRF, CORS, XSS, Content Security Policy and many more**.

There is a separate guide on [Security](security), make sure to read it carefully and enable/disable desired features.

## Scaffolding

**Adonis Ace** is a command line utility to perform tasks from your terminal. It ships with plenty of commands to scaffold Controllers, Models, Middleware etc.

### Available Commands

```bash
./ace --help
```

Above command will show a help screen with list of all available commands, which looks quite similar to the below screenshot.

![Adonis Ace Commands](https://i.imgsafe.org/0620a44.png)

In order to know more about a specific command, run the following.

```bash
./ace make:controller --help
```

### Fixing Ace File

`ace` is an executable file lives in the root of your project. While creating a new project, Adonis will setup this file based upon the OS and the installed location of NodeJs. 

When cloning the project repo, or moving between Windows and OSX, you may end up with a non-working `ace` file. In order to fix it, just run the below command.

```bash
adonis fix ace
```

Behind the scenes, Adonis will perform below operations.

1. Setup the correct path of NodeJs on the first line of `ace` file.
2. If you are on Windows, it will create a `ace.cmd` file, which will execute the `ace` file for you.
