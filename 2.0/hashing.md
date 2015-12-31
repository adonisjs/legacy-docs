# Hashing

Hashing is a process of encrypting sensitive data which is not readable to humans. Unlike encryption hash values have one way encryption logic, which means you cannot decrypt the hash value.

Adonis makes use of [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) to hash values.

## Setup

In order to make use of Hash provider, you have to register it inside your application providers inside `bootstrap/app.js`. Add `'adonis-framework/providers/HashProvider'` to the list of providers

```javascript,line-numbers
const providers = [
  'adonis-framework/providers/HashProvider'
]
```

Also make sure to give it an alias, so that you don't have to refer it with the full namespace.

```javascript,line-numbers
const aliases = {
  Hash : 'Adonis/Src/Hash'
}
```

## Hash
Hash is an async process and you can make use of `yield` keyword inside your controllers.

#### make <span>(value [, rounds])</span>

```javascript,line-numbers
const Hash = use('Hash')
const safePassword = yield Hash.make('some-value')

// or
const safePassword = yield Hash.make('some-value', 10)
```

#### verify <span>(value, hash)</span>

```javascript,line-numbers
const Hash = use('Hash')
try {
  yield Hash.verify('plain-value', 'safe-value')
} catch (e) {
  // value does not match
}
```
