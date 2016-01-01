# Request

The request object is passed along route `Closures` and `Controller methods`. The Http request contains a lot of useful information required by you to make decisions for your application.


- [Getting request information](#getting-request-information)
- [Session Management](#session-management)
- [Uploading Files](#uploading-files)
  - [clientName](#clientname)
  - [exists](#exists)
  - [tmpPath](#tmppath)
  - [clientSize](#clientsize)
  - [extension](#extension)
  - [mimeType](#mimetype)
  - [move](#move)
  - [moved](#moved)
  - [uploadPath](#uploadpath)
  - [uploadName](#uploadname)
  - [errors](#errors)


## Getting request information

The request object is glued with the handful of methods to read and fetch information from HTTP request.

```javascript,line-numbers
class UserController{

  *show(request,response) {

    // grabbing user id param
    const userId = request.param('id')

  }

}
```

And inside your routes file

```javascript,line-numbers
Routes.get('user/:id','UserController.show')
```

### input

You can read `GET` and `POST` value for a given key using following method.

```javascript,line-numbers
request.input('name')
```

or can also set a default value if a value for given key is missing.

```javascript,line-numbers
request.input('name','john')
```

### get

Get all query string parameters as an object.

```javascript,line-numbers
request.get()
```

### post

Parse HTTP request body and get post fields.

```javascript,line-numbers
request.post()
```

### all

Fetch merged object containing get and post values

```javascript,line-numbers
request.all()
```

### only

Filter values from `all` method by passing keys

```javascript,line-numbers
request.only('username','email')
```

### except

except is the reverse of `only` , here you can omit keys from request values.

```javascript,line-numbers
request.except('password')
```

### header/headers

Get request header value for a given key.

```javascript,line-numbers
request.header('auth')
```

and to get all headers make use of

```javascript,line-numbers
request.headers()
```

### path

Get request path for current URL.

```javascript,line-numbers
request.path()  // /user/1
```

### method

Get request method

```javascript,line-numbers
request.method() // GET
```

### ajax

Determine whether the request is an ajax request or not.

```javascript,line-numbers
if(request.ajax()){

  // do something

}
```

### pjax


Determine whether the request is a pjax request or not.

```javascript,line-numbers
if(request.pjax()){

  // do something

}
```

### ip

```javascript,line-numbers
const ipAddress = request.ip()
```

Looks for request IP address in the following order and stops when found a reliable IP address.

1. X-Client-IP
2. X-Forwarded-For header may return multiple IP addresses in the format: 'client IP, proxy 1 IP, proxy 2 IP', so we take the first one.
3. X-Real-IP (Nginx proxy/FastCGI)
4. X-Cluster-Client-IP (Rackspace LB, Riverbed Stingray)
5. Permutations of #2 such as X-Forwarded, Forwarded-For, and Forwarded
6. req.connection.remoteAddress
7. req.socket.remoteAddress
8. req.connection.socket.remoteAddress

If cannot find an IP address, return null.

### accepts

filters and return the best possible return type for a request.

```javascript,line-numbers
const returnType = request.accepts();
```

### is

Identifies whether the request is of given type or not.

```javascript,line-numbers
if(request.is('json')){

  // do something

}
```

can also filter multiple content-types

```javascript,line-numbers
if(request.is('json','html')){

  // do something

}
```

### cookie/cookies

Parse, filter and return cookies attached to a given request

```javascript,line-numbers
request.cookie('username')
```

and to get all cookies as an object use

```javascript,line-numbers
request.cookies()
```

### param/params

Return request params , defined on routes.

```javascript,line-numbers
Routes.get('/user/:id','UsersController.index')
```

```javascript,line-numbers
request.param('id')
```

alternatively you can grab all params using

```javascript,line-numbers
request.params()
```


## Session Management

Adonis has out of the box support for managing sessions and ships with couple of session drivers, which includes `file` and `cookie`.

You can define session driver inside `config/session.js` file and make sure to set `APP_KEY` inside `.env` file to encrypt and sign your cookies.


#### defining session driver

```javascript,line-numbers
// config/session.js
module.exports = {
  driver: Env.get('SESSION_DRIVER') || 'cookie' // can be file or cookie
}
```


#### put <span>(key, value [, options ]</span>
adds key/value pair to session store

```javascript,line-numbers
yield request.session.put('name', 'value')
// or
yield request.session.put({name:'value'})
// or
yield request.session.put('name', 'value', options)
```

**options**

| Property | type | description |
|-----------|-------|------------|
| path      | String | cookie path |
| expires      | Date | absolute expiration date for the cookie (Date object) |
| maxAge      | String | relative max age of the cookie from when the client receives it (seconds) |
| domain      | String | domain for the cookie |
| secure      | Boolean | Marks the cookie to be used with HTTPS only |
| httpOnly      | Boolean | Flags the cookie to be accessible only by the web server |
| firstPartyOnly | Boolean | Defines cookie to be used by the same domain only |



#### get
will return value from session for a given key

```javascript,line-numbers
const name = yield request.session.get('name')
```



## Uploading Files

File uploads in Adonis get treated differently than any other datatype. Each uploaded file is an instance of `File` class and has handful of methods to manage file uploads.

```javascript,line-numbers
const profile = request.file('profile')
```

and then you can perform following operations on selected file.

#### clientName

getting file name while uploading.

```javascript,line-numbers
profile.clientName()
```

#### exists

finding whether the file exists inside temp path or not

```javascript,line-numbers
if(!profile.exists()){
  return profile.errors()
}
```

#### tmpPath

getting the temporary path to a uploaded file.

```javascript,line-numbers
profile.tmpPath()
```

#### clientSize

```javascript,line-numbers
profile.clientSize()
```

#### extension

```javascript,line-numbers
profile.extension()
```

#### mimeType

```javascript,line-numbers
profile.mimeType()
```

#### move

Moving file to a given path

```javascript,line-numbers
yield profile.move(toPath)
```


#### moved

```javascript,line-numbers
if(profile.moved()){

  // upload was successful

}
```

#### uploadPath

Getting full path to uploaded file

```javascript,line-numbers
if(profile.moved()){

  // fetching path to uploaded file
  const uploadPath = profile.uploadPath()

  // fetching user
  let user = User.find(1)
  user.profile_image = uploadPath

  // updating user
  yield user.save()

}

```

#### uploadName

Getting just the file name.

```javascript,line-numbers
profile.uploadName()
```

#### errors

Getting the list of errors while uploading file.

```javascript,line-numbers
if(!profile.moved()){

  return profile.errors()

}
```
