# Ace Commands

Ace commands are terminal commands you invoke from command line using `node ace` followed by command name. Adonis ships with plenty of commands to speed up your development workflow.

You can also write your own commands inside `app/Commands` directory and this guide will walk you through on how to go about writing your own commands.

- [Writing First Command](#writing-first-command)
  - [Signature](#signature)
  - [Description](#description)
  - [handle](#handle)
- [Console](#console)
  - [prompts](#prompts)
  - [colored output](#colored-output)
- [Dependency Injection](#dependency-injection)
- [Existing Commands](#existing-commands)

## Writing First Command

Ace commands are just ES6 classes and are stored inside `app/Commands` directory of your project. As your commands are project specific, they have access to all the providers or modules of a given application.

In order to create for first **Hello World** command, let's start by creating `Greet.js` file inside `app/Commands` directory or alternatively you can make use of `ace` to generate this file for you.

```bash,line-numbers
node ace make:command Greet
```

Now let's create a command that will greet a user by saying **Hello** and their name.

```javascript,line-numbers
class Greet {

  static get signature () {
    return 'greet {name}'
  }

  static get description () {
    return 'Command to greet you with your name'
  }

  * handle (options, flags) {
    return `Hello {options.name}`  
  }
}
```

### Signature

Command signature defines the command name and options or flags required by it. Command signature is a string defining requirements in a given pattern.

#### option
Options are defined inside curly braces, and you can accept multiple options for a given command.
```line-numbers
{name}
```

#### optional options
By default all options are required, but you can make them optional by adding `?` after option name.

```line-numbers
{name?}
```

#### default value
For optional options you can define default value if in case value has not been passed while running command.

```line-numbers
{name?=virk}
```

#### option description
You can also define description for a given option.

```line-numbers
{name?=virk : Name will be used in your personalized greeting}
```

#### flags
Everything with options is true with flags, except flags starts with `--`.

```line-numbers
{--plain}
```

#### flags with value
By default flags are considered as boolean values, which means if a flag is present it is considered to be true. Also you can define that your flag accepts value instead of just being present.

```line-numbers
{--user=@value}
```

`@value` defines that your flag accepts a value.

### Description
Command description does not defines the behavior of command and is optional, but it is considered to be a good practice to define command description, as the end-user using the command is unaware of what a command is supposed to do.

```javascript,line-numbers
static get description () {
  return 'Generate a new controller file'
}
```

### handle

`handle` is a generator method, which is executed everytime your command is invoked. `ace` itself will handle validations for you based on defined options and flags before executing handle method.

## Console

Console is a helper class which can be used to add common functionality to your commands and you must extend this class before using any of the defined methods.

```javascript,line-numbers

const Console = use('Console')

class Greet extends Console {

}
```

### prompts

You can make use of multiple methods to prompt a user and collect answers interactively.

#### ask <span>(question [, defaultValue] ) </span>

```javascript,line-numbers
const name = yield this.ask('What is your name ?')
// or
const name = yield this.ask('What is your name ?', 'virk')
```

####
