# Helpers

Helpers provider gives you handy methods to lookup paths to different directories for Adonis application. It is very hard to get the reference to a given path especially for service providers installed as npm modules.

- [Basic Usage](#basic-usage)
- [Methods](#methods)
  - [basePath](#basepath)
  - [appPath](#apppath)
  - [publicPath](#publicpath)
  - [appNamespace](#appnamespace)
  - [configPath](#configpath)
  - [storagePath](#storagepath)
  - [resourcesPath](#resourcespath)
  - [viewsPath](#viewspath)
  - [migrationPath](#migrationpath)
  - [base64Encode](#base64encode)
  - [base64Decode](#base64decode)

## Basic Usage

In order to make use of Helpers provider, you need to pull an instance from the Ioc container.

```javascript,line-numbers
const Helpers = use('Helpers')
const publicPath = Helpers.publicPath()
```

## Methods

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

### publicPath <span>([toFile])</span>
returns path to the public directory, optionally you can build path to a given file inside public directory.

```javascript,line-numbers
Helpers.publicPath()
// or
Helpers.publicPath('style.css')
```

### appNamespace
returns application namespace, defined under `package.json` file.

```javascript,line-numbers
const appNamespace = Helpers.appNamespace()

// fetching user controller
const UserController = use(`${appNamespace}/Http/Controllers/UserController`)
```

### configPath <span>([toFile])</span>
returns path to the config directory, optionally you can build path to a given file inside config directory.

```javascript,line-numbers
Helpers.configPath()
// or
Helpers.configPath('database.js')
```

### storagePath <span>([toFile])</span>
returns path to the storage directory, optionally you can build path to a given file inside config directory.

<div class="note">
 <strong> Note: </strong> storage directory is intended to be used for temporary storage and is ignored under `.gitignore` file . If you are planning to store permanent data inside it, make sure to remove it from `.gitignore` file
</div>

```javascript,line-numbers
Helpers.storagePath()
// or
Helpers.storagePath('users.yaml')
```

### resourcesPath <span>([toFile])</span>
returns path to the storage directory, like many other methods you can build a path to a given file inside resources directory.

```javascript,line-numbers
Helpers.resourcesPath()
// or
Helpers.resourcesPath('views')
```

### viewsPath <span>([toFile])</span>
returns path to the views directory, you can also build a path to a given file inside views directory.

```javascript,line-numbers
Helpers.viewsPath()
// or
Helpers.viewsPath('index.html')
```

### migrationPath <span>([toFile])</span>
returns path to migrations directory, you can also build a path to a given file inside migrations directory.

```javascript,line-numbers
Helpers.migrationPath()
// or
Helpers.migrationPath('create_users_table.js')
```

### base64Encode <span>([unencoded])</span>
returns encoded base64 string

```javascript,line-numbers
Helpers.base64Encode('Adonis Framework')
```

### base64Decode <span>([encoded])</span>
returns decoded base64 string

```javascript,line-numbers
Helpers.base64Decode('QWRvbmlzIEZyYW1ld29yaw==')
```
