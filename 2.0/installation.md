# Installation

Installing Adonis is a fairly simple process which requires `>= node 4.0` with `>= npm 3.0`. We also recommend [nvm](https://github.com/creationix/nvm) to install and manage multiple versions of NodeJS.

- [ES6 Features](#es6-features)
- [Installing Adonis Cli](#installing-adonis-cli)
- [Cloning Repo](#cloning-repo)

## ES6 Features

Adonis is built on top of `ES6` also known as `ES2015`, which makes the code more enjoyable and cleaner to read. We do not make use of any transpiler and depends upon core v8 implemented features.

<div class="__note">
  <strong>Note</strong>
  The latest version of NodeJS supports the following features.
</div>

1. ES6 Generators.
2. ES6 Classes.
3. ES6 Variable types (support for `let` and `const`).
4. Template Strings.
5. Arrow Functions
6. Proxies (with `--harmony_proxies` flag)

## Installing Adonis CLI

CLI is a terminal tool to scaffold and generate the Adonis project with all required dependencies.

#### Install the CLI

```bash,line-numbers
npm install -g adonis-cli
```

#### Generate a new project

```bash,line-numbers
adonis new yardstick
cd yardstick
npm start
```

## Cloning

You can also clone [adonis-app](https://github.com/adonisjs/adonis-app.git) manually and then install required dependencies, using npm:

```bash,line-numbers
git clone --dissociate https://github.com/adonisjs/adonis-app yardstick
cd yardstick
npm install --production
```

and then finally you can start the app by running:

```bash,line-numbers
npm start
```

<div class="__note">
  <strong>Note</strong>
  If you would like to have hot-reloading you can use [nodemon](http://nodemon.io/) to run your application.

  ```bash,line-numbers
  npm install -g nodemon
  nodemon --watch app --harmony_proxies server.js
  ```
</div>
