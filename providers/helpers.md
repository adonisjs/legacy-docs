---
title: Helpers
permalink: helpers
description: AdonisJs helpers for easy path access.
weight: 6
categories:
- providers
---

{{TOC}}

AdonisJs Helper's provider makes it easier to get absolute paths to different project directories. It is especially useful for 3rd party service providers, as relying on relative paths is not very helpful.

## Basic Example

Anywhere inside your application, you can make use of Helper's provider to get paths to different directories.

```javascript
const Helpers = use('Helpers')

const storagePath = Helpers.storagePath()
```

## Helpers Methods

#### basePath

Returns path to the application root.

```javascript
Helpers.basePath()
```

#### appPath

Returns path to the `app` directory.

```javascript
Helpers.appPath()
```

#### publicPath([toFile])

Returns path to the `public` directory or path to a file inside the directory.

```javascript
const publicPath = Helpers.publicPath()
// or
const cssFile = Helpers.publicPath('style.css')
```

Just like `publicPath` there are other helper methods to return path to other directories.

| Method | Directory |
|--------|-----------|
| configPath | config|
| storagePath | storage|
| resourcesPath | resources|
| migrationsPath | database/migrations|
| seedsPath | database/seeds|
| databasePath | database
| viewsPath | views

#### appNameSpace

Returns namespace used to map the `app` directory. Namespace is defined inside `package.json` file.

```javascript
Helpers.appNameSpace()
```

#### makeNameSpace(directory, toFile)

Returns complete namespace for a file inside a given directory.

```javascript
const httpListener = Helpers.makeNameSpace('Listeners', 'Http')

// returns App/Listeners/Http.js
```

It gracefully handles the scenario when `toFile` is a fully qualified namespace in itself.

```javascript
const httpListener = Helpers.makeNameSpace('Listeners', 'App/Listeners/Http')

// returns App/Listeners/Http.js
```

#### isAceCommand

Returns whether the process was started as the `ace` command or not.

```javascript
Helpers.isAceCommand()
```