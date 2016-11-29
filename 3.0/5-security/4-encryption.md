---
title: Encryption
permalink: encryption
description: Encrypting values in AdonisJs
categories:
- security
---

{{TOC}}

Encryption provider is based upon [NodeJs crypto](https://nodejs.org/api/crypto.html) to encrypt and decrypt values with a SALT. By default all values are encrypted using `aes-256-cbc` algorithm.

Make sure to set `appKey` in your `config/app.js` file to make encryption work. Additionally, you can also define different encryption algorithm using `encryption` key.

## Setup

In order to make use of Encryption provider, you have to register it inside your application providers inside `bootstrap/app.js`. Add `'adonis-framework/providers/EncryptionProvider'` to the list of providers

```javascript,line-numbers
const providers = [
  'adonis-framework/providers/EncryptionProvider'
]
```

Also, make sure to give it an alias, so that you don't have to use it with the full namespace.

```javascript,line-numbers
const aliases = {
  Encryption : 'Adonis/Src/Encryption'
}
```

## Encrypt

```javascript,line-numbers
const Encryption = use('Encryption')
Encryption.encrypt('hello world')
```

## Decrypt

```javascript,line-numbers
Encryption.decrypt('encrypted value')
```
