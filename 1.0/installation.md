# Installation

Installing Adonis is fairly simple and requires the latest version of `node` and `npm`. It is recommended to use [nvm](https://github.com/creationix/nvm) which is a node version manager and helps you in maintaining clean echo system.



- [Requirements](#requirements)
	- [Es6 Features](#es6-features)
- [Installing Adonis Cli](#installing-adonis-cli)
- [Generating Project](#generating-project)



## Requirements

Make sure node version on your machine is `>=v4.0.0` with npm `>=v2.0.0`. As Adonis is built on top of ES6, following ES6 features should be supported.


### Es6 Features

Adonis is built on top of Es6, making the code more enjoyable and cleaner to read. We do not make use of any transpiler and depends upon core v8 implemented features.

<div class='__note'>
	<p>
		<strong> Note : </strong>
		Latest version of NodeJs supports following features.
	</p>
</div>

1. Es6 Generators.
2. Es6 Classes.
3. Es6 Variable types ( support for let and const ).
4. Template Strings.
5. Proxies ( with --harmony_proxies flag )


## Installing Adonis Cli

Cli generates blueprint for Adonis application and install all required dependencies using `npm`.

```bash,line-numbers
npm install -g adonis-cli
```

`-g` flag will install it globally on your machine, giving you the access to run commands from anywhere on the terminal.


## Generating Project

```bash,line-numbers
adonis new <path_to_project>
cd <path_to_project>
npm start
```
