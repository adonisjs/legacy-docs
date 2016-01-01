# Env

Env provider gives you the access to `environment` variables. You start by defining environment specific variables in `.env` file under your project root.



- [Defining Environment Variables](#defining-environment-variables)
- [Reading Values](#reading-values)
- [Writing Values](#writing-values)



## Defining Environment Variables

You can define end number of key/value pairs inside `.env` file and make sure to keep it inside `.gitignore` as it is never a good idea to commit your environment files as each environment should have their own .env file.

```env,line-numbers
APP_PORT=3000
CACHE_VIEWS=false
NODE_ENV=development
APP_KEY=BDx8VD8AbRfV16ur60P9J5lLAnmAITtY
```



## Reading Values

Once you have `.env` file in place, you start reading values from it.

```javascript,line-numbers
const Env = use('Env')
Env.get('APP_PORT')
```



## Writing Values

```javascript,line-numbers
const Env = use('Env')
Env.set('NODE_ENV','production')
```