# Env

Env provider gives you the access to `environment` variables. You start by defining environment specific variables in `.env` file under the root of your project.

- [Defining Environment Variables](#defining-environment-variables)
- [Reading Values](#reading-variables)
- [Writing Values](#writing-values)

## Defining Environment Variables

You can define end number of key/value pairs inside `.env` file and make sure to keep it inside `.gitignore` as it is never a good idea to commit your environment files as each environment should have their own `.env` file.

```env,line-numbers
APP_PORT=3000
CACHE_VIEWS=false
NODE_ENV=development
APP_KEY=BDx8VD8AbRfV16ur60P9J5lLAnmAITtY
```

## Reading Values

Once you have `.env` file in place, you can start reading values from it.

### get <span>(key [, defaultValue])</span>

```javascript,line-numbers
const Env = use('Env')
Env.get('APP_PORT')
// or
Env.get('APP_PORT', 3000)
```

## Writing Values

```javascript,line-numbers
const Env = use('Env')
Env.set('NODE_ENV','production')
```
