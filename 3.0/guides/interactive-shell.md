---
title: Interactive Shell Aka Ace
permalink: interactive-shell
description: Interactive shell commands in AdonisJs
weight: 12
categories:
- guides
---

{{TOC}}

Ace is a powerful command line tool crafted for AdonisJs. So far you have been using lots of `ace` commands to generate controllers, models, run migrations, etc. In this guide, we will learn about the internals of Ace and how to create your own commands.

## Philosophy

`ace` is an executable file inside the root of your application. Commands are specific to individual projects. Which means a command created inside one project cannot be accessed from the another project. We recommended creating **npm packages** for reusable commands.

By enforcing project-specific commands, it becomes so easy for you to access project-specific modules like **Models, Views, Routes** within your commands.

## Creating Your First Command

Commands are stored in `app/Commands` directory and each  command is an `ES2015` class. You can make use of `ace` to create a new command for you.

```bash
./ace make:command Quote
```

Output

```bash
create: app/Commands/Quote.js
```

We are going to create a command to pull random quotes of **Paul Graham** using [Wisdom API](http://gophergala.github.io/wisdom/) and display it on the terminal.

In order to fetch quotes, we need to make an HTTP request and for that, we are going to make use of [got](https://npmjs.org/package/got).

```bash
npm i --save got
```

##### app/Commands/Quote.js

```javascript
'use strict'

const Command = use('Command')
const got = use('got')

class Quote extends Command {

  get signature () {
    return 'quote'
  }

  get description () {
    return 'Display a random quote from Paul Graham'
  }

  * handle (args, options) {
    const response = yield got('https://wisdomapi.herokuapp.com/v1/author/paulg/random')
    const quote = JSON.parse(response.body)
    console.log(`\n${this.colors.gray(quote.author.name)} - ${this.colors.cyan(quote.author.company)}`)
    console.log(`${quote.content}\n`)
  }

}

module.exports = Quote
```

Each command should be inherited from the base `Command` class and must implement `signature` and `handle` method. 

1. `signature` defines the command name and the requirements of the command.
2. Whereas `handle` method is the body of the command and executed automatically by Ace when the command is executed.

Next we need to register this command inside `bootstrap/app.js` file under `commands` array.

##### bootstrap/app.js
```javascript
const commands = [
  'App/Commands/Quote',
  ...
]
```

Now you can check the list of ace commands and `quote` will be listed at the top.

```bash
./ace --help
```

Output

```bash
quote               Display a random quote from Paul Graham
....
```

Let's execute this command to fetch an inspirational quote and display it on the terminal.

```bash
./ace quote
# Output

Paul Graham - YCombinator
Startups don’t win by attacking. They win by transcending. There are exceptions of course, but usually, the way to win is to race ahead, not to stop & fight.

```

## Command Signature

Command Signature defined as a getter `signature` defines the command name and it's required and optional arguments or options.

#### Command with the only name

Return a plain string to define the name of the command.

```javascript
get signature () {
    return 'make:controller'
}
```


#### Command with required argument

Arguments are surrounded by **curly braces**, a single command can have as many arguments as it wants. 

```javascript
get signature () {
    return 'make:controller {name}'
}
```


#### Optional argument

Append `?` to the argument, name to make it optional. Just like your route parameters.

```javascript
get signature () {
    return 'make:controller {name?}'
}
```

#### Argument description

Also, you set a description for an argument separating it with a **colon ( : )**.

```javascript
get signature () {
    return 'make:controller {name:Name of the controller}'
}
```

Just like arguments, commands can also accept `flags` which are defined explicitly when running commands.

#### Command with required options

An option always starts with `-` or `--`.

```javascript
get signature () {
    return 'make:controller {name} {--resource}'
}
```

#### Optional option

Just like arguments, you can also make options optional by appending a `?`.

```javascript
get signature () {
    return 'make:controller {name} {--resource?}'
}
```

#### Options with aliases

Often options have aliases like `-h` for `--help`. You can define multiple aliases for a given option separated by a comma.

```javascript
get signature () {
    return 'make:controller {name} {-r,--resource?}'
}
```

#### Options that accepts values

At times options accept values to perform certain operations and same can be achieved by making use of `@value` identifier.

```javascript
get signature () {
    return 'make:controller {name} {--template=@value}'
}
```

In order to define the template, you need to run the following command.

```bash
./ace make:controller User --template=/templates/controller.mustache
```

## Prompting For Inputs

When creating interactive commands you can make use of handful methods to ask for sequential questions. For example:

```javascript
class UserSurvey {

    * handle () {
        
        const name = yield this.ask('What is your name?').print()
        const skills = yield this.multiple('What skills you have?', ['Designing', 'Programming', 'Shell Scripting']).print()
        
        console.log(`${name} knows ${skills.join(',')}`)
    
    }

}
```

#### ask(question, [defaultValue])

`ask` for a question that accepts textual input. Optionally you can define `defaultValue` which will be returned when no input has been passed.

```javascript
yield this.ask('Enter project name', 'yardstick').print()
```

#### choice(question, choices, [defaultChoice])

Display a list of choices to be used for selection. Only one of the listed options can be selected.

```javascript
yield this.choice('Choose a free daily meal', ['BreakFast', 'Lunch', 'Dinner'], 'BreakFast').print()
```


#### multiple(question, choices, [defaultChoices])

Display a list of multiple choices with an optional array of pre-selected values. Unlike `choice` you can select multiple values.

```javascript
yield this.multiple('You know?', ['Javascript', 'Elm', 'Haskell', 'Ruby']).print()

// or

yield this.multiple('You know?', {
    js: 'Javascript',
    elm: 'Elm',
    hsk: 'Haskell',
    ruby: 'Ruby'
}).print()
```

#### anticipate(question, choices, [defaultChoice])

Shows a list of actions with their keyboard shortcuts. It is helpful when you want the user to `anticipate` on something.

```javascript
yield this
    .anticipate('Conflict in file.js?', [
        {key: 'y', name: 'Delete it'},
        {key: 'a', name: 'Overwrite it'},
        {key: 'i', name: 'Ignore it'}
    ])
    .print()
```

#### secure(question, [defaultValue])

Ask for a secure input like a **password** or some secret **token**. The input value will be show as `******`.

```javascript
yield this.secure('What is your password?').print()
```

#### confirm(question, [defaultValue])

Ask for a `yes/no` question.

```javascript
yield this.confirm('Are you sure you want to delete selected files?').print()
```

## Validating Inputs

It is extremely useful to validate input when accepting the values from interactive questions. All prompt questions can be validated by chaining the `validate` method and returning `true` from the callback will be considered as successfully validated.

```javascript
yield this.ask('Enter coupon code').validate(function (input) {
    return input === 'adonisjs' ? true : 'Enter a valid coupon code'
}).print()
```

## ANSI Output

[Ansi Escape Codes](https://en.wikipedia.org/wiki/ANSI_escape_code) are used to output colored text to the terminal using a sequence of multiple characters. For example: To output a green color **Hello World** to the terminal you need to log following.

```javascript
console.log('\033[32m Hello World')
```

It is so hard to remember these codes and unpleasant to write it. Also, you will have to deal with different `shell types` to get the right output. AdonisJs commands can make use of following methods to print colorful messages to the terminal.

#### error(message)

Following will print a red color text.

```javascript
this.error('Sorry, something went wrong')
```

#### success(message)

Success output will be green

```javascript
this.success('All done!')
```

#### info(message)

```javascript
this.info('Just letting you know')
```

#### warn(message)

```javascript
this.info('Wait! something seems fishy')
```

#### completed(action, message)

Will output a structured message for a completed action. Where action name will have green text color.

```javascript
this.completed('create', 'Created the controller file')
```

Output

```bash
create: Created the controller file
```

#### failed(action, message)

Same as completed but the action name will be in red color.

```javascript
this.failed('create', 'Sorry controller file already exists')
```

Output

```bash
create: Sorry controller file already exists
```

#### table(head, body)

Also, you can create tables from Ace commands.

```javascript
this.table(['username', 'age'], [{'virk': 26}, {nikk: 25}])

// or
this.table(['key', 'value'], {username: 'foo', age: 22, email: 'foo@bar.com'})
```

## Icons & Colors

Additionally, you can output icons and add color to your console messages using your command instance.

```javascript
const Command = use('Command')

class Greet extends Command {

    * handle () {
        
        const successIcon = this.icon('success')
        console.log(`${successIcon} That went great`)
    
    }

}

module.exports = Greet
```

Output

```bash
✔ That went great
```

Below is the list of icons you can make use of.

| Icon | Name |
|------|------|
| ℹ | info |
| ✔ | success |
| ⚠ | warn |
| ✖ | error

Under the hood, Ace makes use of [colors](https://www.npmjs.com/package/colors) an npm module. You can access all the available methods of **colors** using the property `colors`.

```javascript
this.colors.green('This is all green')
this.colors.red.underline('i like cake and pies')
```