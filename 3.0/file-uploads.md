---
title: File Uploads
permalink: file-uploads
weight: 7
categories:
	- basics
---

Files are uploaded with care in Adonis. You can control the upload behaviour by configuring values inside `config/bodyParser.js`.

## Basic Usage

You can get the access to a file instance using the name of `input[type="file"]` field.

```javascript
'use strict'

class ProfileController {

	* addAvatar (request, response) {
		const images = ['jpg', 'png', 'gif']

		const avatar = request.file('avatar')

		if (images.indexOf(avatar.extension()) <= -1) {
			response.send('Upload a valid image')
			return
		}
		
		yield avatar.move()
		
		if (!avatar.isMoved()) {
			response.send(avatar.errors())
		}
		
		response.send(`Uploaded to ${avatar.uploadPath()}`)
		
	}

}
```

To get all uploaded files, make use of `files` method

```javascript
request.files()
```

## File Instance Methods

Below is the list of available methods on file instance.

#### clientName

Returns the name of the uploaded file.

```javascript
avatar.clientName()
```

#### mimeType

Returns mime type of the upload file.

```javascript
avatar.mimeType()
```

#### extension

Returns file extension.

```javascript
avatar.extension()
```


#### clientSize

Returns the size of uploaded file in bytes.

```javascript
avatar.clientSize()
```

#### tmpPath

Returns file path inside the tmp directory.

```javascript
avatar.tmpPath()
```

#### exists

Returns a boolean indicating whether the file exists inside the tmp directory or not.

```javascript
if (avatar.exists()) {
	yield avatar.move()
}
```


#### move(toPath, name)

Moves a file to a given directory. 

```javascript
yield avatar.move(Helpers.storagePath('uploads'))
// or
const fileName = `${userId}.${avatar.extension()}`
yield avatar.move(Helpers.storagePath('uploads'), fileName)
```

#### isMoved

Returns whether the file has been moved successfully or not.

```javascript
if (avatar.isMoved()) {
	// 
}
```

#### errors
Returns errors occurred while moving the file.

```javascript
if (!avatar.isMoved()) {
	const errors = avatar.errors()
}
```

#### uploadPath

Returns the complete path to the uploaded file.

```javascript
yield avatar.move(Helpers.storagePath('uploads'))
if (avatar.isMoved()) {
	response.send(`Uploaded to ${avatar.uploadPath()}`)
}
```

#### uploadName

Returns the name of the uploaded file.

```javascript
yield avatar.move(Helpers.storagePath('uploads'), 'foo.jpg')
if (avatar.isMoved()) {
	response.send(`Uploaded as ${avatar.uploadName()}`)
}
```