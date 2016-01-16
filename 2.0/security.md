# Security

Adonis includes a middleware called `Shield` to protect your applications from malware attacks and fake requests. It includes commonly required security features like CSRF protection and many more.

- [Setup](#setup)
- [CSRF Protection](#csrf-protection)
  - [Config](#config)
  - [Validating Requests](#validating-requests)
  - [Accessing Token](#accessing-token)
  - [Error Handling](#error-handling)
- [Content Security Policy](#content-security-policy)
- [Malware Protection](#malware-protection)

## Setup
Adonis includes shield middleware by default with every new installation of Adonis application. If you are upgrading from an older application `(below 2.0.6)`, it is very much likely that you do not have it setup inside `kernel.js` file.

#### installing middleware module
```bash,line-numbers
npm i --save adonis-middleware
```

#### setting up provider
Inside `boostrap/app.js` file, you need to include the app middleware provider to use Shield.

```javascript,line-numbers
const providers = [
  'adonis-middleware/providers/AppMiddlewareProvider'
]
```

#### registering middleware
Finally you are required to register it as a global middleware inside `app/Http/kernel.js` file.

```javascript,line-numbers
const globalMiddlewares = [
  'Adonis/Middleware/Shield'
]
```

## CSRF Protection

CSRF Protection is the first step towards keeping your application secure from unidentified requests. It helps you in making sure that actions like `create`, `read` and `delete` are taken by right people from right place.

A classic example of `CSRF` is to have a form to create a user. Now your form will have a secret token which is generated on your webpage only. While submitting the form you send this secret token to your save request handler. Which ensures that the save request is initiated from an identified place.

Any attackers who are trying to create users from a CURL request or any other mechanism will not have that secret token and as a result they will not be able to create a user.

#### Config

Configuration for CSRF is saved inside `config/shield.js` file under `csrf` object.

```javascript,line-numbers
csrf: {
  enable: true,
  methods: ['POST', 'PUT', 'DELETE'],
  filterUris: []  
}
```

##### enable <span>(boolean)</span>
Defines whether or not to activate CSRF protection. Setting it to `false` will disable it.

##### methods <span>(array)</span>
An array of http request methods or verbs to validate for CSRF token.

##### filterUris <span>(array)</span>
An array of url's to ignore. You can pass routes pattern or regular expressions here.

```javascript,line-numbers
filterUris: ['/user/(.+)'] // will match /user*
```

#### Validating Requests

All requests according to above config are validated automatically. Shield will attempt to read values from various inputs to get the token and if failed an exception will be thrown.

1. Request body or query string can have `_csrf` field.
2. Header called `csrf-token` or `x-csrf-token` or `x-xsrf-token`.

#### Accessing Token

You can access CSRF token inside your views and controllers using following helper methods.

<div class="__note">
  <strong> Note </strong> Below methods will be undefined if you have disabled CSRF protection.
</div>

##### csrfField

`csrfField` returns an input field with hidden type. Make sure to filter it through safe filter to render the html without escaping it.

```twig,line-numbers
 {{ csrfField | safe }}
```

##### csrfToken

```twig,line-numbers
 {{ csrfToken }}
```

##### csrfToken
```
request.csrfToken()
```

#### Error Handling
On validation failure `401` error is thrown with error code as `EBADCSRFTOKEN`. You can use this code to show custom error message.

```javascript,line-numbers
App.on('error', function (error, request, response) {
  if (error.code === 'EBADCSRFTOKEN') {
    response.status(error.status).send('You are not allowed to access this resource.')
    return
  }
})
```

## Content Security Policy

Content Security Policy (CSP) helps you in defining the trusted sources for loading and executing script, styles, fonts and various other resources.

Configuration for CSP is stored inside `config/shield.js` file under `csp` object.

```javascript,line-numbers
csp: {
  directives: {
  },
  reportOnly: false,
  reportUri: '/csp-report',
  setAllHeaders: false,
  disableAndroid: true
}
```

#### directives
Directives helps you in defining policies to be applied on different resource types. You can get list of all directives from http://content-security-policy.com.

For inline `script` execution you can use `@nonce` keyword inside your directives.

```javascript,line-numbers
directives: {
  scriptSrc: ['self', '@nonce']
}
```

Now you can access `nonce` inside your views using view helper method.

##### cspNonce

```twig,line-numbers
<script nonce="{{ cspNonce }}">
</script>
```

##### cspMeta
By default Shield will set the required HTTP headers to enforce CSP policies when loading your webpages. But you can also access these values as meta tags inside your views.

```twig,line-numbers
<head>
  {{ cspMeta | safe }}
</head>
```

#### reportOnly
`reportOnly` will thrown an error, instead will return a warning and will execute all scripts.

#### reportUri
Browsers will send the violation report on defined report uri. You need to register this route manually. Also make sure to ignore this route inside CSRF `filterUris`.

```javascript,line-numbers
Route.post('csp-report', function * (request, response) {  
  console.log(request.all())
  response.status(204).send()
})
```

#### setAllHeaders
`setAllHeaders` Shield sets different http headers for different browsers, it you want to disable this behavior, you can this value to true and all headers will be set. [Browsers Support](http://caniuse.com/#feat=contentsecuritypolicy)

#### disableAndroid
Android is buggy with CSP, you can disable it for android in case you face any troubles.

## Malware Protection

Malware protection helps in protecting your website from `XSS` attacks, unwanted iframe embeds, content type sniffing and stopping IE from executing unwanted scripts in context of your webpage.

Configuration for below methods is defined under `config/shield.js` file.

#### XSS
Protecting from XSS attacks. Older versions of IE leads to vulnerability defined [here](http://hackademix.net/2009/11/21/ies-xss-filter-creates-xss-vulnerabilities/), so you can disable it for older versions of IE by setting the value to `false`.

```javascript,line-numbers
xss: {
  enabled: true,
  enableOnOldIE: false
}
```

#### No Sniff
Majority of modern browsers will try to detect the `Content-type` of a request by sniffing it's content. Which means a file ending in `.txt` can be executed as `javascript` file, if it contains javascript code. To disable this behavior set `nosniff` to true.

```javascript,line-numbers
{
  nosniff: true
}
```

#### No Open

This setting will stop IE from executing unknown script in context of your website.

```javascript,line-numbers
{
  noopen: true
}
```
