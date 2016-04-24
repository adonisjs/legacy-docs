---
title: Installation
permalink: installation
weight: 1
categories:
	- getting-started
---

{{TOC}}

Installing Adonis is a fairly simple process and will take only few minutes. If you ever face any problems, please [file an issue](https://github.com/adonisjs/adonis-framework/issues).

## Requirements

Adonis has no other dependencies other than NodeJs and Npm.We also recommend making use of [nvm](https://github.com/creationix/nvm) to install and manage NodeJs.

1. [NodeJs](https://nodejs.org/en/) version `4.0` or greater.
2. [Npm](https://www.npmjs.org/) version `3.0` or greater.

## Adonis Cli

Adonis cli is a command line utility to install stable and development releases of Adonis with all required dependencies.

```bash
npm i -g adonis-cli
```

### Creating New Project

Once you have installed the `adonis-cli`, run the following command to create a new project.

```bash
adonis new yardstick
cd yardstick
npm run dev
```

### Dev Release

All major releases of Adonis starts with a dev release. This is the time where all features get locked, but left for testing and feedback before the final release.

In order to create a dev project, simply add `--dev` flag to the new command.

```bash
adonis new yardstick --dev
```

## Manual Installation

Setting up a new Adonis project is a combination of multiple actions, which can be performed manually.

### Clone the repo

```bash
git clone --dissociate https://github.com/adonisjs/adonis-app yardstick
cd yardstick
```

### Install Dependencies

```bash
npm install
```


## Starting server

Once the installation process is completed, you can start the application by using below commands.

```bash
npm start
// or
npm run dev // to start server with hot-reloading
```

`npm run dev` will make use of [nodemon.io](http://nodemon.io/) to start the dev server with hot-reloading. 