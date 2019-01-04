# Query Scopes

Query scopes help you in defining expressive bindings to query builder. For example: - to fetch all active users you can define scope with a where clause on user status.

- [Defining Scopes](#defining-scopes)
- [Using Scopes](#using-scopes)
- [Passing Arguments](#passing-arguments)

## Defining Scopes
You need to follow some conventions while defining query scopes. You start by using a fixed keyword `scope` and then define `Pascal case` string.

```javascript,line-numbers
class User extends Lucid {

  scopeActive (query) {
    return query.where('status', 1)
  }

}
```

## Using Scopes
While using scoped methods there is no need to make use of `scope` keyword, and you can use rest of the method as `camel case`.

```javascript,line-numbers
const activeUsers = yield User.active().fetch()
```

## Passing Arguments
At times, you need to pass arguments to your query scopes and same can be done quite easily.

```javascript,line-numbers
class User extends Lucid {

  scopeFromCountry (query, country) {
    return query.where('country', country)
  }

}
```

```javascript,line-numbers
const indianUsers = yield User.fromCountry('India').fetch()
```
