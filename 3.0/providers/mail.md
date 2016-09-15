---
title: Mail
permalink: mail
description: Sending Emails In AdonisJs
weight: 7
categories:
- providers
---

{{TOC}}

AdonisJs has beautiful Mail provider to make it so simple to send emails using **SMTP**, **Amazon SES**, **Mandrill** and **MailGun**. Mail provider also has a **Log** driver, which can be used to write tests as it will not send emails to real people.

## Setup

Mail provider is not part of the base installation, which means you need to download it from `npm` and register the service provider.

```bash
npm i --save adonis-mail-provider
```

Next, you need to register it inside the providers array.

##### bootstrap/app.js
```javascript
const providers = [
    ...,
    'adonis-mail-provider/providers/MailProvider'
]
```

Also, make sure to give it an alias.

```javascript
const aliases = {
    Mail: 'Adonis/Addons/Mail'
}
```

Next, you need the configuration file which will be saved inside `config/mail.js`. You can download the config file from [github](https://github.com/adonisjs/adonis-mail/blob/master/examples/mail.js).

## Basic Example

You can send emails from anywhere inside your application using the Mail provider.

```javascript
const Mail = use('Mail')

const user = {
    name: 'Kitten',
    email: 'kitten@example.org'
}

yield Mail.send('emails.welcome', user, (message) => {
    message.to(user.email, user.name)
    message.from('me@example.org')
    message.subject('Welcome to the Kitten\'s World')
})
```

`send` method expect the first argument to a view. So let's create this view.

```bash
./ace make:view emails/welcome
# on Windows
ace make:view emails/welcome
```

##### resources/views/emails/welcome.nunjucks

```twig
<h2> Hello {{ name }} </h2>

<p> Welcome to the Kitten's world, we will be sharing lots of cute kittens with you soon. </p>
```

## Sending Emails

#### send(view, data, callback, [configKey])

`send` method will compile a view with given data and send it as HTML. Attached `callback` gives you the access to the `message` object to define email properties.

```javascript
yield Mail.send('receipt', {name: 'Doe', amount: 22}, (message) => {
    
})
```

**view** parameter can also take an array of views for  HTML, plain text, and for Apple watch.

```javascript
yield Mail.send(['receipt', 'receipt.text', 'receipt.watch'])
```

#### raw(body, callback, [configKey])

Send email using raw text, instead of using a view.

```javascript
yield Mail.raw('Your security code is 301030', (message) => {
    message.from('secret@yourcompany.com')
    message.to('doe@example.org', 'Doe')
})
```

## Email Message Builder

`message` argument passed to the callback is used to define email properties.

#### from(email, [name])

```javascript
message.from('doe@example.com', 'John Doe')
```

#### sender(email, [name])

An e-mail address that will appear on the `Sender:` field.

```javascript
message.sender('doe@example.com', 'John Doe')
```

#### replyTo(email, [name])

```javascript
message.replyTo('doe@example.com', 'John Doe')
```

#### to(email, [name])

```javascript
message.to('jane@example.com', 'Jane Doe')
```

#### cc(email, [name])

```javascript
message.cc('jamie@example.com', 'Jamie Doe')
```

#### bcc(email, [name])

```javascript
message.bcc('me@example.com', 'Me')
```

#### subject(message)

```javascript
message.subject('Welcome to Adonis')
```

#### priority(level)

Email priority to be set for email. It can be one of the following:

- high
- low
- normal

```javascript
message.priority('high')
```

#### header(key, value)

```javascript
message.header('x-id', 1)
```

#### headers(arrayOfHeaders)

```javascript
message.header([{key: 'x-id', value: 1}])
```

#### attach(filePath, [options])

```javascript
message.attach(__dirname, '/assets/logo.png')
// or
message.attach(__dirname, '/assets/logo.png', {filename: 'MyLogo.png'})
```

Options to the `attach` method are optional and can be one of the following.

| Key | Type | Description |
|-----|------|-------------|
| filename | String |     Name of the file. If not defined, will be picked from the file path.|
| contentType | String | Attachment content type. If not defined, will be picked from the file extension.|
| contentDisposition | String | Content-disposition, defaults to **attachment**.|
| encoding | String | Attachment encoding can be `base64`, `hex`, or `binary`.|

#### attachData(data, filename, [options])

Attach raw data as an attachment to the email.

```javascript
message.attachData('some raw content', 'raw.txt')
```

#### embed(filePath, cid, [options])

Embed a file inside the content.

```javascript
messsage.embed(__dirname, '/assets/logo.png', 'logo')
```

Inside your email view, you can reference the `cid`.

```twig
<img src="cid:logo" />
```

#### html(body)

HTML of the email is automatically created from the view, but if for any reasons you want to override, make use of this method.

```javascript
message.html('My custom html')
```

#### text(body)

Set `text` body for the email clients, who does not support HTML. Pass an array to the `send` to define a **view** for plain text.

#### watchHtml(body)

Define custom HTML for Apple watch, which will be picked from a view when defined within the `send` method.

## Switching Drivers

Base driver to be used for emails is defined inside the config file. But you can also switch to different drivers on runtime.

```javascript
const mandrill = Mail.driver('mandrill')

yield mandrill.send('emails.welcome', {}, (message) => {
    ...
})
```

## Adding New Drivers

You can also add new drivers to the **mail provider**. Internally mail provider makes use of [node mailer](https://github.com/nodemailer/nodemailer), you can easily wrap node mailer transports to drivers.

Each driver should be an `ES2015` class and must have a `send` method, which should return a **Promise**. Apart from this, there are no hard rules. 

Let's create a driver for PostMark using [nodemailer postmark transport](https://github.com/killmenot/nodemailer-postmark-transport).

```javascript
class PostMark {
    
    constructor (Config) {
        this.config = Config
        this.transport = this._createTransport('mail.postmark')
    }
    
    _createTransport (configKey) {
        const options = this.config.get(configKey)
        const nodemailer = require('nodemailer')
        const postmarkTransport = require('nodemailer-postmark-transport')
        return nodemailer.createTransport(postmarkTransport(options))
    }
    
    send (message, configKey) {
        let transport = this.transport
        if (configKey) {
            transport = this._createTransport(configKey)
        }
        return transport.sendMail(message)
    }

}

module.exports = PostMark
```

Above is a pretty standard way to send emails using node mailer. We just wrap it inside a class to make sure it works well with AdonisJs. Let's extend the mail provider and add this driver.

##### bootstrap/extend.js

```javascript
const Ioc = use('adonis-fold').Ioc

Ioc.extend('Adonis/Addons/Mail', 'postmark', function (app) {
  const Config = app.use('Adonis/Src/Config')
  return new PostMark(Config)
})
```

Now you can make use of the **postmark** driver, just like any other inbuilt driver.

```javascript
yield Mail.driver('postmark').send('emails.welcome', (message) => {
    ...
})
```

## Testing Emails

AdonisJs ships a `Log` driver, which can be used when writing tests. Log driver will save all the emails to `storage/logs/mail.eml` file as a string. You can parse this file to make test assertions.
