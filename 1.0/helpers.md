# Helpers

Helpers provider gives you handy methods to lookup paths to different directories for Adonis application. It is very hard to get the reference to a given path especially for service providers installed as npm modules.



- [Using Helpers](#using-helpers)
  - [basePath](#basepath)
  - [appPath](#apppath)
  - [publicPath](#publicpath)
  - [appNamespace](#appnamespace)
  - [configPath](#configpath)
  - [storagePath](#storagepath)
  - [resourcesPath](#resourcespath)
  - [viewsPath](#viewspath)



## Using Helpers

To make use of the `Helpers` provider, you need to pull an instance from the Ioc container.

```javascript,line-numbers
const Helpers = use('Helpers')
```


### basePath
returns path to the root of project.

```javascript,line-numbers
Helpers.basePath()
```


### appPath
returns path to the app directory.


```javascript,line-numbers
Helpers.appPath()
```


### publicPath
Path to public directory , which is used to serve static assets

```javascript,line-numbers
Helpers.publicPath()
```


### appNamespace

As app directory is registered under a given namespace, it is important to know the `baseNamespace` to fetch mappings using Ioc container. **Example**

```javascript,line-numbers
const appNamespace = Helpers.appNamespace()

// fetching UserController
const UserController = use(`${appNamespace}/Http/Controllers/UserController`)
```


### configPath
Path to config directory

```javascript,line-numbers
Helpers.configPath()
```



### storagePath
Path to storage directory, you can store anything inside this directory.

<div class='__note'>
	<p><strong>Note : </strong>storage directory is intended to be used for temporary storage and is ignored under `.gitignore` file . If you are planning to store permanent data inside it, make sure to remove it from .gitignore file
</p>
</div>

```javascript,line-numbers
Helpers.storagePath()
```


### resourcesPath
Path to resources directory

```javascript,line-numbers
Helpers.resourcesPath()
```


### viewsPath
Path to application views

```javascript,line-numbers
Helpers.viewsPath()
```
