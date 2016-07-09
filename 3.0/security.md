---
title: Security
permalink: security
description: Tools and settings to keep AdonisJs applications secure.
weight: 10
categories:
- guides
---

{{TOC}}

The majority of the security features are baked right into AdonisJs with the help of a middleware called [shield](https://github.com/adonisjs/adonis-middleware). Shield protects your apps from common web/malware attacks.

## Setup

Every application has `shield` middleware pre-configured, and all you need is to make sure it is registered as a **Global middleware** inside the `app/Http/kernel.js` file.

```javascript
const globalMiddlewares = [
  'Adonis/Middleware/Shield'
]
```

## Config

The configuration for shield is defined inside `config/shield.js` file. Each configuration block belongs to a certain security feature we will be talking about.


## CSRF Protection

CSRF Protection is the first step towards keeping your application secure from unidentified requests. It helps you in making sure that actions like `create`, `read` and `delete` are taken by right people from right place.

You can learn more about CSRF [here](https://www.owasp.org/index.php/Cross-Site_Request_Forgery).

```javascript
csrf: {
  enable: true,
  methods: ['POST', 'PUT', 'DELETE'],
  filterUris: ['/user/:id']
}
```

Key | Value | Description
------|-------|----------
enable | Boolean | A boolean to turn on/off CSRF for the entire application.
methods | Array | HTTP verbs to be protected by CSRF. Consider adding all verbs which allow the end user to add or modify data.
filterUris | Array | A list of URLs/Routes to ignore. You can pass actual routes definition or a regular expression to match.

While validating the requests, middleware will look at the following areas to read the CSRF token.

1. Request body or query string having `_csrf` field.
2. Request header with following keys.
  - **csrf-token**
  - **x-csrf-token**
  - **x-xsrf-token**

## Accessing CSRF Token

In order to send the token along with each request, you need access to it. There are a few ways to get access to the CSRF token.

```twig
{{ csrfField }}

{#
  returns
  <input type="hidden" name="_csrf" value="xxxxxx" />
#}
```

Use following to get the raw token.
```twig
{{ csrfToken }}
```

With in the controller file
```javascript
request.csrfToken()
```

## Handling CSRF Errors

On validation failure, an `EBADCSRFTOKEN` Exception is thrown and same can be handled within the `app/Listeners/Http.js` file.

```javascript
Http.handleError = function * (error, request, response) {
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
  directives: {
    defaultSrc: ['self', 'http://getcdn.com'],
    scriptSrc: ['self', '@nonce'],
    styleSrc: ['http://getbootstrap.com'],
    imgSrc: ['http://dropbox.com']
  },
  reportOnly: false,
  setAllHeaders: false,
  disableAndroid: true
}
```

| Key | Value | Description |
|-----|-------|-------------|
| directives | Object | Directives helps you in defining policies to be applied on different resource types. You can get list of all directives from http://content-security-policy.com.|
| reportOnly | Boolean | It will not stop the execution of your page, instead, will return a humble warning that some rules are violated.|
| setAllHeaders | Boolean | Shield sets different HTTP headers for different browsers. To disable this behavior, you can this value to true and all headers will be set.|
| disableAndroid | Boolean | Android is buggy with CSP, you can disable it for android in case you face any troubles.|

Learn more about CSP [Browsers Support](http://caniuse.com/#feat=contentsecuritypolicy).

#### CSP Meta Tag

`shield` automatically sets the required HTTP headers for CSP to work. But also gives you a view helper to set the meta tag.

```twig
{{ cspMeta }}

{#
  returns
  <meta http-equiv="Content-Security-Policy" content="xxx">
#}
```

Above will create a meta tag with the required content inside it.

#### CSP Nonce

Inline Script is a javaScript code, which lives within the HTML page. Some 3rd party plugins can drop their JavaScript to your web pages, which may not be something you are looking for.

Disabling `Inline Scripts` is not very helpful. So `nonce` is a way to identify inline scripts created by you vs dropped by unidentified resources.

##### config/shield.js
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

Malware protection helps in protecting your website from **XSS** attacks, unwanted iframe embeds, content type sniffing and stopping IE from executing unwanted scripts in the context of your web page.

#### XSS

Protection against XSS attacks. Older versions of IE leads to vulnerability defined [here](http://hackademix.net/2009/11/21/ies-xss-filter-creates-xss-vulnerabilities/), so you can disable it for older versions of IE by setting the value to false.

```javascript
xss: {
  enabled: true,
  enableOnOldIE: false
}
```

#### No Sniff

The majority of modern browsers will try to detect the `Content-Type` of a request by sniffing its content. Which means a file ending in `.txt` can be executed as javascript file, if it contains javascript code. To disable this behavior set `nosniff` to true.

```javascript
{
  nosniff: true
}
```

#### No Open

This setting will stop IE from executing unknown script in the context of your website.

```javascript
{
  noopen: true
}
```
