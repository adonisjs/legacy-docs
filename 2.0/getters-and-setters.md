# Getters And Setters

Getters and setters allow you to format attributes on your data models. Converting user statuses from integer to strings, formatting phone numbers before saving are good examples of Setters.

## Getters
Getters transform data after you fetch them from your database and to define a getter you make use of a defined pattern. For example `first_name` field inside the database will be accessed as `getFirstName` , where you convert actual field name to Pascal case and prepend `get` keyword to it.

```javascript,line-numbers
class User extends Lucid {

  getStatus (value) {
    return value === 0 ? 'inactive' : 'active'
  }

}
```

Now when you fetch data using your model, `status` field will be transformed on the fly for you.

```javascript,line-numbers
const User = use('App/Model/User')
const user = yield User.where('id',1).first().fetch()
user.toJSON().status
```

## Setters

They transform attributes on your data model before you save or update them. Again it makes use of the same convention but instead of using `get` keyword you make use of `set` keyword.

```javascript,line-numbers
class Users extends Lucid {

  setPhoneNumber (value) {
    return value.toString().replace(/(\d{3})(\d{3})(\d{4})/,'$1-$2-$3')
  }

}
```
Now before saving or updating values we will format phone numbers as (333-333-4444) using above method.