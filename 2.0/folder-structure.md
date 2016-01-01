# Folder Structure

In Adonis, every folder and file have a logical place in your project structure. We tried following tested industry conventions to setup folder structure.

```bash,line-numbers
├── app/
│ ├── Commands/
│ ├── Http/
│ ├── Model/
│ ├── Services/
│ │ ├── Controllers/
│ │ ├── Middleware/
│ │ ├── routes.js
│ │ ├── kernel.js
├── bootstrap/
│ ├── app.js
│ ├── http.js
│ ├── kernel.js
│ ├── start.js
├── config/
├── migrations/
├── public/
├── providers/
├── resources/
│ ├── views
├── storage/
│── .env
│── ace
│── server.js
│── package.json
```

## app directory

This is the directory where you will spend most of your time and it is autoloaded under a namespace `App`, which can be edited inside `package.json` file

```json,line-numbers
"autoload": {
  "App": "./app"
}
```

app directory contains several sub directories to keep your project organized.

#### Commands
This directory will store your personal `ace` commands.

#### Http
Everything related to http requests will go under this directory.

#### Model
Database models.

#### Services
Helper directory to isolate certain tasks and re-use them inside your controllers or in-fact anywhere inside your application. Adonis itself does not load anything from this directory.

## bootstrap
Adonis joins different components under this directory and you will likely never have to get into it except from adding new providers inside `bootstrap/app.js`.

## config
Storing all configuration inside this directory helps you in making use of [Config](/config) provider which get/set values using a fluent syntax. Make sure to export config values using `module.exports`.

## migrations
Stores your database migrations

## public
static resources to be available to everyone. Consider keeping your `css` or `images` here.

## providers
Consider keeping your providers under this directory.

## resources
resources are frontend files/assets related to your project. May be it is a good place to keep your sass/less files. It also has a sub directory to keep views.

## storage
Storage is used to store temporary data. It is ignored inside `.gitignore` file.
