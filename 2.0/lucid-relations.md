
# Database Relations

Lucid makes it easier for you to fetch related data from multiple models out of the box.

Every database driven application requires data relations and fetching them manually can be overhead to maintain, that's why lucid makes it super easy and readable to resolve multiple relations.

<p>&nbsp;</p>

- [Basic Usage](#basic-usage)
- [Relationships](#relationships)
  - [hasOne](#hasOne)
  - [hasMany](#hasMany)
  - [belongsTo](#belongsTo)
  - [belongsToMany](#belongsToMany)
- [Fetching Relations](#fetching-relations)
  - [with](#with)
  - [nested relations](#nested-relations)
- [Extending Relations](#extending-relations)
  - [query methods](#query-methods)
  - [query scopes](#query-scopes)
  - [withPivot](#with-pivot)
- [Inserting Related Models](#inserting-related-models)
  - [create](#create)
  - [associate](#associate)
  - [dissociate](#dissociate)
  - [attach](#attach)
  - [detach](#detach)

<p>&nbsp;</p>

## Basic Usage

Setting up and fetching relations are super easy with Lucid. Let's take the below example where we want to fetch all posts by a given user/author for a given post.

#### User model

```javascript,line-numbers
// app/Model/User.js

class User extends Lucid {

  posts() {
    return this.hasMany('App/Model/Post')
  }  

}
```

#### Post Model

```javascript,line-numbers
// app/Model/Post.js

class Post extends Lucid {

  author () {
    return this.belongsTo('App/Model/User')
  }

}
```

#### fetching posts for a given user

```javascript,line-numbers
const user = yield User.find(1)
const userPosts = yield user.posts().fetch()
```

#### fetching author for a given post

```javascript,line-numbers
const post = yield Post.find(1)
const postAuthor = yield post.author().fetch()
```

<p>&nbsp;</p>

## Relationships

Depending upon the nature of relation you can easily define relationships using `expressive` methods.

<p>&nbsp;</p>

#### hasOne <span>(model,targetKey,foreignKey)</span>

Defines one to one relationship between two models.

```javascript,line-numbers
class User extends Lucid {

  profile () {
    return this.hasOne('App/Model/Profile')
  }

}
```

#### hasMany <span>(model,targetKey,foreignKey)</span>

Defines one to many relationships between two models.

```javascript,line-numbers
class User extends Lucid {

  posts () {
    return this.hasMany('App/Model/Posts')
  }

}
```

#### belongsTo <span>(model,targetKey,foreignKey)</span>

Defines one to one relationship on host model.

```javascript,line-numbers
class Profile extends Lucid {

  user () {
    return this.belongsTo('App/Model/User')
  }

}
```

#### belongsToMany <span>(model,pivotTable,targetPrimaryKey,foreignPrimaryKey)</span>

Defines many to many relationships between two models.

```javascript,line-numbers
// app/Model/Book
class Book extends Lucid {

  authors () {
    return this.belongsToMany('App/Model/User')
  }

}

// app/Model/User
class User extends Lucid {

  books () {
    return this.belongsToMany('App/Model/Book')
  }

}
```


<p>&nbsp;</p>

## Fetching Relations

Lucid provides a handful of convenient ways to fetch relations while keeping your code readable and expressive.
<p>&nbsp;</p>

#### with <span>(*models)</span>

`with` method provides a convenient way to fetch host model with its relation under one data object. Also, you can fetch nested relations or multiple relations using `with` method.

```javascript,line-numbers
const user = yield User.where('id',1).first().with('posts').fetch()
```

#### nested relations

Let's say you want to fetch all users from a given country with their posts.

```javascript,line-numbers
const postsFromIndia = yield Country.where('locale','IND').with('users.posts').fetch()
```
So simple it is ! final result will have all the users from a given country with their posts under a child object.

<p>&nbsp;</p>

## Extending Relations

Defining relations is of no good if you cannot define their behavior while fetching them. Think of a situation where you want to pull only published posts for a given user? Let's achieve desired results in different ways.

<p>&nbsp;</p>

#### query methods

```javascript,line-numbers
// app/Model/User.js
class User extends Lucid {

  posts () {
    return this.hasMany('App/Model/Post').where('status','published')
  }

}

yield User.where('id',1).with('posts').fetch()

```
now you can fetch posts for a given user and lucid will make sure to fetch published posts only.

#### query scopes

Above is the best use case for a situation where you never want any other posts apart from published. Whereas for situational queries you can make use of `scope` method.

```javascript,line-numbers
// app/Model/User.js
class User extends Lucid {

  posts () {
    return this.hasMany('App/Model/Post')
  }

}

// fetching posts with status draft
const drafts = yield User
.where('id',1)
.with('post')
.scope('posts', function (query) {
  query.where('status','draft')
})
.fetch()
```

#### withPivot

`belongsToMany` relations are fetched via pivot table, and Lucid by default ignores any other fields apart from foreign keys. If you want to pull those extra fields, you can make use of `withPivot` method.

```javascript,line-numbers
class User extends Lucid {

  books() {
    return this.belongsToMany('App/Model/Book').withPivot('is_first_author')
  }

}
```

<p>&nbsp;</p>

## Inserting Related Models

Lucid provides convenient ways to insert related models and sets up foreign keys behind the scenes for you. You can only insert related models using model instance.

#### create
`hasOne` and `hasMany` specific only.

```javascript,line-numbers
const user = new User()
user.username = 'foo'

yield user.create()

// inserting related model
yield user.posts().create({title:'Adonis 101',status:'draft'})

```

#### associate
you can associate related models under `belongsTo` relation using `associate` method.

```javascript,line-numbers
const post = yield Post.find(1)
const user = yield User.find(1)

post.author().associate(user)

yield post.update()
```

#### dissociate
dissociate is opposite of associate and will set `foreign key` to null.

```javascript,line-numbers
const post = yield Post.find(1)
post.author().dissociate()

yield post.update()
```

#### attach
attach method is `belongsToMany` specific only as it help you in associating relations under pivot table.

```javascript,line-numbers
const user = yield User.find(1)
const bookId = 1

yield user.books().attach(bookId)
```

#### detach
detach method is `belongsToMany` specific only and is opposite of `attach` method.

```javascript,line-numbers
const user = yield User.find(1)
const bookId = 1

yield user.books().detach(bookId)
// or remove all books
yield user.books().detach()
```
