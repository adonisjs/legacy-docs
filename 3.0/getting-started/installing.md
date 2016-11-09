---
title: Installing AdonisJs
permalink: installation
description: Installing AdonisJs on OSX, Linux, And Windows.
weight: 1
categories:
- getting-started
---

{{TOC}}

Installing AdonisJs is a fairly simple process and will only take few minutes. If you ever face any problems, please [file an issue](https://github.com/adonisjs/adonis-framework/issues) on GitHub for same.

## Requirements

AdonisJs makes use of features natively supported by Node.Js and does not use any additional transpilers or compilers. Below is the list of requirements:

1. [Node.js](https://nodejs.org/en/) version **4.0** or greater.
2. [npm](https://www.npmjs.org/) version **3.0** or greater.


Also, it is recommended to make use of [nvm](https://github.com/creationix/nvm) to install and manage multiple versions of Node.Js.

## Installing Adonis-CLI

Adonis-CLI is a command line tool to install stable and dev releases of AdonisJs with all required dependencies. It is an [npm package](https://www.npmjs.com/package/adonis-cli) and needs to be installed globally.

```bash
npm i -g adonis-cli
```

## Creating New Project

You will have access to `adonis` command on your terminal after installing the Adonis-CLI. Let's make use of it to create a new project.

```bash
adonis new yardstick
```

Output

```bash
Cloning into 'yardstick'...
cleaning project
setting up app key
Fixing ace file
installing dependencies may take a while
installing dependencies...
```

Above command will create a new directory called `yardstick` with pre-defined project structure and will install required dependencies from npm.

## Serving The App

You are all set to see your brand new project.

```bash
cd yardstick
npm run dev
```

Output

```bash
[nodemon] starting `node --harmony_proxies server.js`
info adonis:framework serving app on localhost:3333
```

By default, AdonisJs will use port `3333` to start the server, which is configurable. Now open [http://localhost:3333](http://localhost:3333) to see the welcome page.

![](http://res.cloudinary.com/adonisjs/image/upload/v1472841298/WelcomePage_qkpjiw.png)

## Manual Installation

If for any reasons you are not using Adonis-CLI ( which you should ), you have to perform following steps to clone the repo from GitHub and manually install dependencies.

```bash
git clone --dissociate https://github.com/adonisjs/adonis-app yardstick
cd yardstick
```

```bash
npm install
```

## Starting Server

AdonisJs makes use of [nodemon.io](http://nodemon.io/) to start the development server with hot-reloading.

```bash
npm run dev // to start the server with hot-reloading
# or
npm start // without hot-reloading
```
