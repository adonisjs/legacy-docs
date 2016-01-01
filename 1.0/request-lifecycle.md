# Request Lifecycle

Adonis application is divided into two components and each request entering your application have to be of following types.


- [Http Request](#http-request)
- [Terminal Commands](#terminal-commands)


## Http Request

The Http request comes via one of your registered routes and then follows a set of instructions defined by you in your app.
Before application reaches your routes, Adonis behind the scenes does a lot of work to boot your web server, and it happens in ordered way.
Below hierarchy is followed to boot your application for Http requests.


### loading bootstrap/http.js file

1. To start your server, you run `node ace start:server` command.
2. Which invokes `server.js` which requires `bootstrap/http.js` file and call `bootstrap()` method start HTTP server.


### loading service providers

`boostrap/http.js` file requires `bootstrap/app.js` file in order to register service providers inside Ioc container.
Once Ioc injection cycle is stable, we start on including internal components of your application.


### registering middleware

Next we register middleware defined inside `app/Http/kernel.js` so that routes can use them.


### registering routes

Next we register routes and their corresponding handlers from `app/Http/routes.js` file.


### starting http server.

Finally, we start HTTP server on a given port, by now your application has access to all service providers.


## Terminal Commands

Terminal commands referred as `ace commands` gives you extra hands to interact and write terminal commands in an easier way.
What makes Ace commands special is that they have access to all service providers and other components of your application.
Lifecycle process for terminal commands starts the same way as for HTTP requests, but obviously we do not register routes, middleware, and other HTTP specific components.


### Running ace commands.

Adonis comes with the handful of ace commands from generating controllers to migrating the database.

Type

```bash,line-numbers
node ace --help
```

to see the list of available commands and their descriptions.
To see help for a specific command, type command and pass `--help` flag.

```bash,line-numbers
node ace make:controller --help
```
