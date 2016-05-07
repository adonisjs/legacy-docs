---
title: Security
permalink: security
weight: 2
categories:
- first-steps
---

Majority of the security features are baked into Adonis from starting. Adonis ships with a middleware called [shield](https://github.com/adonisjs/adonis-middleware) to protect your apps from common web/malware attacks.

## Setup

Every application has `shield` middleware pre-configured, but it's always nice to understand how the setup process works.

Install the middleware if already not included

```bash
npm i --save adonis-middleware
```

Installed provider makes sure to register all the middleware to the IoC container, which later can be referenced inside your Http kernel file.

##### bootstrap/app.js
```javascript
const providers = [
	...,
	'adonis-middleware/providers/AppMiddlewareProvider'
]
```

Finally you need to register the middleware inside the `app/Http/kernel.js` file.

```javascript
const globalMiddlewares = [
	'Adonis/Middleware/Shield'
]
```

## Config

The configuration for shield is defined inside `config/shield.js` file. Each configuration block belongs to a certain security feature we will be talking about.


## CSRF Protection

CSRF Protection is the first step towards keeping your application secure from unidentified requests. It helps you in making sure that actions like `create`, `read` and `delete` are taken by right people from right place.

You can learn more about CSRF [here](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)).

```javascript
csrf: {
	enable: true,
	methods: ['POST', 'PUT', 'DELETE'],
	filterUris: []
}
```

Key | Value | Description
------|-------|----------
enable | Boolean | A boolean to turn on/off CSRF for entire application.
methods | Array | HTTP verbs to be protected by CSRF. Consider adding all verbs which allows the end user to add or modify data.
filterUris | Array | A list of Urls/Routes to ignore. You can pass actual routes definition or a regular expression to match. For example-

#### filterUris

```javascript
filterUris: ['/user/:id'] // will match /user/id
// or
filterUris: ['/user/(.+)'] // will match /user*
```


All requests are validated automatically by the `shield` middleware. Validation failure will abort the request and throws an `EBADCSRFTOKEN` Exception.

While validating the requests, middleware will try to read the CSRF token from defined inputs.

1. Request body or query string having `_csrf` field.
2. Request header with following keys.
	- **csrf-token**
	- **x-csrf-token**
	- **x-xsrf-token**

## Accessing CSRF Token

In order to send the token along with each request, you need access to it. There are few view and request helpers to fetch the token from.

#### Hidden Input Field

```twig
{{ csrfField }}
```

Above will create an hidden input field with value set to CSRF Token.

#### Raw Token

```twig
{{ csrfToken }}
```

#### On Request Object

```javascript
request.csrfToken()
```

#### Error Handling

On validation failure an `EBADCSRFTOKEN` Exception is thrown and same can be handled within the `app/Listeners/Http.js` file.

```javascript
Helpers.handleError = function * (error, request, response) {
	if (error.code === 'EBADCSRFTOKEN') {
		response.forbidden('You cannot access this resource.')
	}
}
```

## Content Security Policy

Content Security Policy (CSP) helps you in defining the trusted sources for loading and executing script, styles, fonts and various other resources.

It is very important to be strict when allowing the execution of scripts from different sources. You must read more about CSP [here](http://content-security-policy.com/).

```javascript
csp: {
  directives: {},
  reportOnly: false,
  setAllHeaders: false,
  disableAndroid: true
}
```

#### directives

Directives helps you in defining policies to be applied on different resource types. You can get list of all directives from http://content-security-policy.com.

#### reportOnly

It will not stop the execution of your page, instead will return a humble warning that some rules are violated.

#### setAllHeaders

Shield sets different http headers for different browsers, it you want to disable this behaviour, you can this value to true and all headers will be set.

Learn more about [Browsers Support](http://caniuse.com/#feat=contentsecuritypolicy).

#### disableAndroid

Android is buggy with CSP, you can disable it for android in case you face any troubles.

### CSP Meta Tag

`shield` automatically sets the required headers for CSP to work. But also gives you a view helper to set the meta tag.

```twig
{{ cspMeta }}
```

Above will create a meta tag with the required content inside it.

### CSP Nonce

Inline script is a javascript code, which lives within the HTML page. Some 3rd party plugins can drop their Javascript to your webpages, which may not be something you are looking for.

Disabling `Inline Scripts` is not very helpful. So `nonce` is a way to identify inline scripts created by you vs dropped by unidentified resources.

**config/shield.js**
```javascript
csp: {
	directives: {
	  scriptSrc: ['self', '@nonce']
	},
	...
}
```

And then you can make use of another view helper to get access to a unique identifier to mark your script tags safe.

```twig
<script nonce="{{ cspNonce }}">
</script>
```

## Malware Protection

Malware protection helps in protecting your website from **XSS** attacks, unwanted iframe embeds, content type sniffing and stopping IE from executing unwanted scripts in context of your webpage.

### XSS

Protecting from XSS attacks. Older versions of IE leads to vulnerability defined [here](http://hackademix.net/2009/11/21/ies-xss-filter-creates-xss-vulnerabilities/), so you can disable it for older versions of IE by setting the value to false.

**config/shield.js**
```javascript
xss: {
  enabled: true,
  enableOnOldIE: false
}
```

### No Sniff

Majority of modern browsers will try to detect the `Content-type` of a request by sniffing its content. Which means a file ending in `.txt` can be executed as javascript file, if it contains javascript code. To disable this behaviour set `nosniff` to true.

```javascript
{
	nosniff: true
}
```

### No Open

This setting will stop IE from executing unknown script in context of your website.

```javascript
{
  noopen: true
}
```