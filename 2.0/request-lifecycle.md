# Request Lifecycle

Adonis application is divided into two components and each request entering your application have to be a terminal command or an Http request.

- [Boot Lifecycle](#boot-lifecycle)
- [Http Request](#http-request)
- [Terminal Command](#terminal-command)

## Boot Lifecycle
Before your application can accept incoming requests, you are supposed to boot Adonis server using `npm start` command, which will invoke `server.js` file to start server on a given host and port.

#### registering providers
bootstrap process involves registering providers to the IOC container, which is done inside `bootstrap/http.js` file. All providers mentioned inside `bootstrap/app.js` are registered and become available for use.

#### autoloading
`app` directory under the root of your project is registered for autoloading, files under this directory are lazy loaded and exported only when they are required. Adonis follows the concept of namespaces, which means all files under `app` directory will given a namespace, which can be used to require that file.

Read more about [autoloading]().

#### registering routes and middleware
Next we register routes and middleware to be used for http requests.

## Http Requests

Http requests are layered through middleware before reaching your registered route, if a static resource inside `public` directory is not found for a request, it will look for a route and finally will throw a 404 error if nothing is found.

Pre-flight request for `CORS` do not even reach to the point of resolving route or static resource as middleware has the power to finish the request at any stage.

## Terminal Commands

Boot Lifecycle is followed before invoking a terminal command, in addition all commands inside `bootstrap/app.js` file are registered with Ace.

Ace then looks for terminal command inside it's store and if nothing is found it will throw an error `Command not registered with ace`. When a command is found ace automatically will validate it using it's `signature` and invokes the command handle method with defined arguments and options.
