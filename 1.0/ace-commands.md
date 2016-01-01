# Ace Commands

- [Basic Command](#basic-command)
- [Writing Commands](#writing-commands)
	- [signature](#signature)
	- [description](#description)
	- [handle](#handle)
- [Existing Commands](#existing-commands)

Ace commands are terminal commands you run from command line, they makes adonis even more powerful as they have access to all the service providers as any other component of your application.

## Basic Command

You start by saving your commands inside `app/Commands` and make sure to register them by placing namespace inside `bootstrap/app.js` file under `commands` array.

A basic command will look something like this.

```javascript,line-numbers
class Greet{

  static get signature(){
    return 'greet {name}'
  }

  static get description(){
    return 'This command will greet a person with name'
  }

  *handle(options, flags){
    return `Hello ${options.name}`
  }

}

module.exports = Greet
```

after registering above command inside `bootstrap/app.js` file you can run `node ace greet <name>` to run greet command and it will execute the `handle` method for you.

## Writing Commands

Writing ace command is pretty easy, start by defining signature , description and handle method on ES6 class. Also you can inject dependencies to your ace commands using `static get inject` method or type hint them inside class `constructor`.

### signature
Signature defines expectations for your command.


#### command name
```javascript,line-numbers
static get signature(){
  return 'greet'
}
```

#### options
```javascript,line-numbers
static get signature(){
  return 'greet {name} {age}'
}
```

#### optional options
```javascript,line-numbers
static get signature(){
  return 'greet {age?}'
}
```

#### options description
```javascript,line-numbers
static get signature(){
  return 'greet {age?:Age to show your birth year}'
}
```

#### options default value
```javascript,line-numbers
static get signature(){
  return 'greet {name=foo}'
}
```

#### flags
```javascript,line-numbers
static get signature(){
  return 'greet {--admin}'
}
```

#### optional flags
```javascript,line-numbers
static get signature(){
  return 'greet {--admin?}'
}
```

#### flags that expect values
```javascript,line-numbers
static get signature(){
  return 'greet {--admin=@value}'
}
```

### description
setting description for a given command is strongly recommended as it helps other to know what your command is about to do.

```javascript,line-numbers
static get description(){
  return 'Greet a user with their name'
}
```

### handle
handle is a generator method and is executed everytime your registered command is invoked. Ace itself does all validations required before `handle` method is called.

Once executed you will have access to all the options and flags passed to your command as an object.

```javascript,line-numbers
*handle (options, flags) {
  // do whatever you want.
}
```

## Existing Commands

Best way to get list of existing commands for a given project is to run

```bash,line-numbers
node ace --help
```
