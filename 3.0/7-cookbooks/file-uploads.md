---
title: Uploading Files
permalink: uploading-files
description: Uploading files with AdonisJs
categories:
- cookbooks
---

{{TOC}}

AdonisJs has out of the box support for handling file uploads. You can easily manage **bulk uploads**, **file size/extension validation** and add global checks to deny requests containing more than expected payload.

## Basic Example

Let's take an example of uploading user avatar. We will consider this as a **PUT** request to upload the user profile avatar and run necessary validations to make sure the user is uploading the right file.

##### app/Http/routes.js
```javascript
Route.put('/user/:id/avatar', 'UserController.updateAvatar')
```

Next, you need to create the `updateAvatar` method in `UserController`.

##### app/Http/Controller/UserController.js

```javascript
'use strict'

const Helpers = use('Helpers')
const User = use('App/Model/User')

class UserController {

  * updateAvatar (request, response) {
    // getting file instance
    const avatar = request.file('avatar', {
        maxSize: '2mb',
        allowedExtensions: ['jpg', 'png', 'jpeg']
    })

    const userId = request.param('id')        
    const user = yield User.findOrFail(userId)
    const fileName = `${userId}.${avatar.extension()}`

    yield avatar.move(Helpers.storagePath(), fileName)
    if (!avatar.moved()) {
      response.badRequest(avatar.errors())
      return
    }
    user.avatar = avatar.uploadPath()
    yield user.save()
    response.ok('Avatar updated successfully')
  }

}

module.exports = UserController
```

## Config

The configuration for the file uploads is stored inside `config/bodyParser.js` file.

##### config/bodyParser.js
```javascript
uploads: {
	multiple: true,
	hash: false,
	maxSize: '2mb'
}
```

`maxSize` is calculated on all the uploaded files, which means uploading two files of `1.5mb` each will exceed this limit.

The `maxSize` check is performed right at the beginning. This makes sure that attackers are not choking your servers by sending **Gigabytes** of data.

## File Instance

`request.file` returns an instance of `File` class, which has a handful of methods to retrieve uploaded file information and move it to a given path.

Uploading multiple files return an array of `File` class instances. For example:

```javascript
const profilePics = request.file('profile[]')
// returns an array
```

## Validation

**File instance** can manage validation on file size and extensions for you. You just need to pass the options when accessing the instance.

```javascript
const avatar = request.file('avatar', {
    maxSize: '2mb',
    allowedExtensions: ['jpg', 'png']
})
```


Now when you will call the `move` method, the validations will fire based on the defined configuration.

In case, if above validations are not enough for you, you can implement your own `validate` method.

#### Manual Validation

Returning **true** or **false** from `validate` method will define whether the validation has been passed or not. Also, you will be responsible for setting the error message on the file instance manually.

```javascript
const avatar = request.file('avatar')

avatar.validate = function () {

    if (avatar.extension() !== 'foo') {
        avatar._setError('We support foo files only')
        return false
    }
    return true
}
```

## Available Methods

Below is the list of available methods on File instance.

#### clientName

Returns the name of the uploaded file.

```javascript
avatar.clientName()
```

#### clientSize

Returns the size of the file (in bytes).

```javascript
avatar.clientSize()
```

#### mimeType

Returns file mime-type.

```javascript
avatar.mimeType()
```

#### extension

Returns file extension.

```javascript
avatar.extension()
```

#### tmpPath

The path to the temporary folder, where the file was uploaded.

```javascript
avatar.tmpPath()
```

#### exists

Tells whether the file exists inside the temporary folder or not.

```javascript
avatar.exists()
```

#### move(toPath, [newName])

Move the file to a given location with an optional name. If `newName` is not defined, it will make use of `clientName()`

```javascript
yield avatar.move(Helpers.storagePath())
```

#### moved

Tells whether the move operation was successful or not.

```javascript
yield avatar.move(Helpers.storagePath())

if (avatar.moved()) {
    // moved successfully
}
```


#### errors

Returns errors occurred during the `move` process.

```javascript
yield avatar.move(Helpers.storagePath())

if (!avatar.moved()) {
    response.send(avatar.errors())
}
```

#### uploadPath

Full path to the upload directory with the file name.

```javascript
yield avatar.move(Helpers.storagePath())

avatar.uploadPath()
```


#### uploadName

Name of the uploaded file.

```javascript
yield avatar.move(Helpers.storagePath(), 'selfie.jpg')

avatar.uploadName()
```

<div class="note">
    <strong>Note:</strong>
    <code>uploadPath</code> and <code>uploadName</code> will only be available after the move operation.
</div>

#### toJSON

Returns **JSON** representation of the file properties.

```javascript
avatar.toJSON()
```
