---
title: Environment
permalink: environment
description: Environment management provider for AdonisJs
categories:
- general-topics
---

{{TOC}}

AdonisJs makes use of **Environment Variables** to distinguish between values defined for different environments.

Environment specific values are defined inside `.env` file under the root of your project and you can access these values using the **Env Provider**.

## Basic Example

##### .env

```bash
APP_PORT=3333
NODE_ENV=development
```

Now you can access the above values anywhere inside your code using the Env provider.

```javascript
const Env = use('Env')

Env.get('APP_PORT')
// or
if (Env.get('NODE_ENV') === 'development') {
	// do something in development only
}
```

## Loading Environment File

AdonisJs will automatically load the `.env` file from the root of your project. In case you don't want to keep your file inside your project, you can define the `ENV_PATH` to the server start script.

```bash
npm start -- --ENV_PATH=/etc/config/.env
```

## Using Global Environment Variables

If you want to use the directly the environment variables provided by your server you should disable the check for a `.env` file. To do that you need to define the `ENV_SILENT` to the server start script.

```bash
ENV_SILENT=true npm start
```

## Defining Environment Variables

You can define end number of key/value pairs inside `.env` file and make sure to keep it inside `.gitignore` as it is never a good idea to commit your environment files as each environment should have their own `.env` file.

```env,line-numbers
APP_PORT=3000
CACHE_VIEWS=false
NODE_ENV=development
APP_KEY=BDx8VD8AbRfV16ur60P9J5lLAnmAITtY
```

## Reading/Writing Values

Once you have `.env` file in place, you can start reading values from it.

#### get <span>(key, [defaultValue])</span>

```javascript,line-numbers
const Env = use('Env')

Env.get('APP_PORT')
// or
Env.get('APP_PORT', 3000)
```

#### set <span>(key, value)</span>

```javascript,line-numbers
const Env = use('Env')

Env.set('NODE_ENV','production')
```
