# Ace Commands

Ace commands are terminal commands you invoke from command line using `node ace` or `./ace` followed by command name. Adonis ships with plenty of commands to speed up your development workflow.

You can also write your own commands inside `app/Commands` directory and this guide will walk you through on how to go about writing your own commands.

- [Writing First Command](#writing-first-command)
  - [Signature](#signature)
  - [Description](#description)
  - [handle](#handle)
- [Registering Command](#registering-command)
- [Console](#console)
  - [prompts](#prompts)
  - [Notifications](#notifications)
  - [Tables](#tables)
  - [Icons](#icons)
- [Dependency Injection](#dependency-injection)

## Writing First Command

Ace commands are just ES6 classes and are stored inside `app/Commands` directory of your project. As your commands are project specific, they have access to all the providers or modules of a given application.

In order to create for first **Hello World** command, let's start by creating `Greet.js` file inside `app/Commands` directory or alternatively you can make use of `ace` to generate this file for you.

```bash,line-numbers
./ace make:command Greet
```

Now let's create a command that will greet a user by saying **Hello** and their name.

```javascript,line-numbers
const Ansi = use('Ansi')

class Greet {

  static get signature () {
    return '{name}'
  }

  static get description () {
    return 'Command to greet you with your name'
  }

  * handle (options, flags) {
    Ansi.success(`Hello {options.name}`)
  }
}
```

#### Signature

Command signature defines the command name and options or flags required by it. Command signature is a string defining requirements in a given pattern.

##### option
Options are defined inside curly braces, and you can accept multiple options for a given command.
```line-numbers
{name}
```

##### optional options
By default all options are required, but you can make them optional by adding `?` after option name.

```line-numbers
{name?}
```

##### default value
For optional options you can define default value if in case value has not been passed while running command.

```line-numbers
{name?=virk}
```

##### option description
You can also define description for a given option.

```line-numbers
{name?=virk : Name will be used in your personalized greeting}
```

##### flags
Everything with options is true with flags, except flags starts with `--`.

```line-numbers
{--plain}
```

##### flags with value
By default flags are considered as boolean values, which means if a flag is present it is considered to be true. Also you can define that your flag accepts value instead of just being present.

```line-numbers
{--user=@value}
```

`@value` defines that your flag accepts a value.

#### Description
Command description does not defines the behavior of command, but it is considered to be a good practice to define command description, as the end-user using the command is unaware of what a command is supposed to do.

```javascript,line-numbers
static get description () {
  return 'Generate a new controller file'
}
```

#### handle

`handle` is a generator method, which is executed everytime your command is invoked. `ace` itself will handle validations for you based on defined options and flags before executing handle method.

## Registering Command
So far you have created a command and in order to make use of it, you need to register it inside `bootstrap/app.js` file under `commands` object. Also here you define the command name to be used while running the command.

```javascript,line-numbers
const commands = {
  'greet:user': 'App/Commands/Greet'
}
```

## Ansi

Ansi is a helper module which can be used to add common functionality to your commands and you must get it from ioc container before using it.

```javascript,line-numbers
const Ansi = use('Ansi')

class Greet {

}
```

#### prompts

You can make use of multiple methods to prompt a user and collect answers interactively.

##### ask <span>(question [, defaultValue] ) </span>
Prompts to enter a value

```javascript,line-numbers
const name = yield Ansi.ask('What is your name ?')
// or
const name = yield Ansi.ask('What is your name ?', 'virk')
```

##### confirm <span>(question, defaultValue)</span>
Prompts to confirm with yes/no.

```javascript,line-numbers
const usingAdonis = yield Ansi.confirm('Are are using adonis ?')
```

##### choice <span>(question, choices, default)</span>
Propmts to select a single answer

```javascript,line-numbers
const frameworkOfChoice = yield Ansi.choice('Which framework do you use ?', ['Express', 'Koa', 'Sails', 'Adonis'])
```

##### aniticipate <span>(question, choices, default)</span>
anticipate requires a key to be used as an answer. See following

```javascript,line-numbers
const party = yield Ansi.anticipate('Will you attend new year party', [
{
  key: 'y',
  name: 'Yes',
  value: 'yes'
},
{
  key: 'n',
  name: 'No',
  value: 'no'
},
{
  key: 'm',
  name: 'MayBe',
  value: 'maybe'
}
])
```

##### options <span>(question, choices, default)</span>
Propmts to select multiple answers

```javascript,line-numbers
const food = yield Ansi.options('What all would like to eat', ['Chinese', 'Italian', 'Indian'])
```

##### secure <span>(question)</span>
Prompts for a secure input, entered value is starred.

```javascript,line-numbers
license = yield Ansi.secure('Can i have your driving license number?')
```

#### Notifications
There are handful of methods to show colored notifications.

##### error

```javascript,line-numbers
Ansi.error('This is invalid')
// or
Ansi.errorBg("%s is not a valid email", 'foo')
```

##### success
```javascript,line-numbers
Ansi.success(`${Ansi.icon('success')} it works`)
// or
Ansi.successBg('It works')
```

##### warn
```javascript,line-numbers
Ansi.warn('Fire in the hole')
// or
Ansi.warnBg('Fire in the hole')
```

##### info
```javascript,line-numbers
Ansi.info('%j', {name: 'virk'})
// or
Ansi.infoBg('U should check it out')
```

#### Tables
```javascript,line-numbers
Ansi.table(['name', 'age'], [['virk', 22], ['doe', 21]])
// or
Ansi.table([], [{name: 'virk'}, {age: 22}, {email: 'something'}])
```

#### Icons
Ansi has some nifty methods to even print icons on command line.

##### error icon
```javascript,line-numbers
console.log(Ansi.icon('error'))
```

##### success icon
```javascript,line-numbers
console.log(Ansi.icon('success'))
```

##### warning icon
```javascript,line-numbers
console.log(Ansi.icon('warn'))
```

##### info icon
```javascript,line-numbers
console.log(Ansi.icon('info'))
```

## Dependency Injection

Also your ace commands are blessed with automatic resolution of providers out of the box. Each `ace command` is an ES6 class and you can make use of `static inject` method to inject dependencies while writing commands.

```javascript,line-numbers
./ace make:command CreateUser
```

```javascript,line-numbers
// app/Commands/CreateUser

class CreateUser {

  static get inject () {
    return ["App/Model/User"]
  }

  constructor (User) {
    this.user = User
  }

  signature () {
    return '{name} {email} {password} {--admin}'
  }

  description () {
    return 'Create a new user by passing user profile information'
  }

  * handle (options, flags) {
    this.user.name = options.name
    this.user.email = options.email
    this.user.password = options.password
    this.user.role = flags.admin ? 'admin' : 'user'

    yield this.user.create()
    Ansi.success('Created user')
  }

}
```

Finally register it inside commands object in `bootstrap/app.js` file.

```javascript,line-numbers
const commands = {
  'create:user': 'App/Commands/CreateUser'
}
```
