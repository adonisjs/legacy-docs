---
title: Static Files
permalink: static-files
weight: 7
categories:
	- basics
---

{{TOC}}

Static resources are served by the core of the framework. Each HTTP request with `GET` and `HEAD` verb will be check against a static file inside your `public` directory.

If file does not exist, it will start by resolving the route and goes on from there.

## How it Works

`public` directory inside the root of your application is dedicated for static resources like.

1. Css Files
2. Javascript Files
3. Fonts, Images or anything you want to serve directly.

You access these files without the `/public` inside your url's. For example-

A file called `public/style.css` will be accessible on `http://localhost:3333/style.css`.

## Configuration

Configuration of static resources is stored inside `config/app.js` file.

```javascript
static: {
	dotfiles: 'ignore',
	etag: true,
	extensions: false
}
```

#### dotfiles

Defines how to treat files/directories starting with `dot(.)`. This check is performed on the path itself, without checking the existence of file on the disk.

1. **allow** - No special treatment for dotfiles.
2. **deny** - Deny a request for a dotfile with 403.
3. **ignore** - Pretend like the dotfile does not exist and respond with 404.

#### etag

Enable or disable etag generation.

#### extensions

1. Set `false` for no special treatment. 
2. An array of extensions to be used when searching for files. If file with original name is not found, it will try to find them with given extensions.

