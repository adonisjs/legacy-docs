---
title: Hashing
permalink: hashing
description: Bcrypt Hash In AdonisJs
weight: 5
categories:
- providers
---

{{TOC}}

Hashing is a process of encrypting sensitive data which is not readable by humans. Unlike encryption, hash values have one-way encryption logic, which means you cannot decrypt the hash value.

AdonisJs makes use of [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) to hash values. Which is extremely useful for encrypting passwords.

## Hashing/Verifying Values

#### make(value, [rounds])

```javascript
const Hash = use('Hash')
const safePassword = yield Hash.make(request.input('password'))

// or
const safePassword = yield Hash.make(request.input('password'), 10)
```

#### verify(value, hashedValue)

```javascript
const Hash = use('Hash')
const isSame = yield Hash.verify('plain-value', 'hashed-value')

if (isSame) {
  // value is same
}
```