# Folder Structure

In Adonis, every folder and file have a logical place in your project structure. We tried following tested industry conventions to setup folder structure.



```bash,line-numbers
├── app/
│ ├── Commands/
│ ├── Exceptions/
│ │ ├── handler.js
│ ├── Http/
│ │ ├── Controllers/
│ │ ├── Middleware/
│ │ ├── routes.js
│ │ ├── kernel.js
│ ├── Model/
│ ├── Services/
├── bootstrap/
│ ├── http.js
│ ├── kernel.js
│ ├── app.js
├── config/
├── resources/
│ ├── views
├── public/
│── .env
│── server.js
│── package.json

```



## app directory

All directories inside `app` folder are capitalized as they are auto-loaded under a namespace. In order keep things readable, it is a good practice to keep directories or filenames capitalized which get resolved via Ioc container.
#### bad namespace

```bash,line-numbers
app/Http/users
```

#### good namespace

```bash,line-numbers
App/Http/Users
```

Again namespace is a personal preference, but it's good stay with everyone else.


## config

Store your config inside `config` directory, all files are Javascript files and should export configuration as common-js modules.

#### database.js

Your database configuration looks something like below.

```javascript,line-numbers
module.exports = {

    sqlite: {
        client: 'sqlite3',
        ...
    }

}
```


## bootstrap

you may never have to touch this directory, it joins different parts of your application together.


## resources

Here you define everything you need on client-side of your application, Think of it as a place to keep your

* views
* sass/less files
* etc..


## public

Files under public directory are accessible directly and is good to keep following files inside it.

* css files
* fonts
* images
* script files
* etc..


## .env

Environment variables are a good place to keep your configuration isolated for each environment. Inside `.env` file you define everything that can/should be different for each environment.

Make sure to ignore `.env` file while committing your changes and have different files for each environment.


## server.js

Interface to start your HTTP server.


## package.json

Needs no introduction if you are from node community ( which you are ). We have added another key/value pair to `package.json` file to enable autoloading.

```javascript,line-numbers
{
    name: 'your-app-name',
    autoload:{
        'App': './app'
    }
}
```

Here we define `App` as the root namespace for all files and directories under `./app` directory. You must read more about [Ioc container](ioc-container) and [namespacing](ioc-container#namespace).
