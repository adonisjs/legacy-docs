# Faqs
Adonis is a young framework launched on September, 2015. Core of the [framework](https://github.com/adonisjs/adonis-framework) is very stable and well tested but you are about to find missing features as it happens with any other framework when it's young.

- [What is the goal of Adonis?](#what-is-the-goal-of-adonis)
- [Where can i track the progress?](#where-can-i-track-the-progress)
- [Why is it so much like Laravel?](#why-is-it-so-much-like-laravel)
- [Why should i use Adonis?](#why-should-i-use-adonis)
- [Do you have plans on using Typescript?](#do-you-have-plans-on-using-typescript)
- [What the heck are Service Providers?](#what-the-heck-are-service-providers)
- [Is it ready for production environment](#is-it-ready-for-production-environment)

## What is the goal of Adonis?

We are not on a mission of 100%. Which means Adonis cannot be everything to everyone. But we are trying to add ourselves into the category of most stable and expressive framework for Node.

Writing production ready apps needs confidence and it comes when

1. Your framework itself is stable and not coming up with breaking changes everyday.
2. It's well tested.
3. You are able to test your code with any pain.
4. Code is readable to human, so that anyone can from a given team can jump straight into the code.

Adonis is built on the ideas of Ruby on Rails and Laravel, which have been used for years to write stable applications. Sorry we are not going to do cool stuff like any other young generation frameworks in Node.

## Where can i track progress?

[Trello](https://trello.com/b/yzpqCgdl/adonis-for-humans) board is the best place to track progress or get into our [Gitter](https://gitter.im/adonisjs/adonis-framework/) room to see what we are talking about.

## Why is it so much like Laravel?

Or we can say why it is as expressive as Laravel. There is no harm in using conventions and ideas which battle tested and build upon them, this is what we did.

## Why should i use Adonis?

Why should you bet upon us? And here are answers to that.

1. If you want a complete eco-system instead of downloading and making decisions on which module to use.
2. If you like writing expressive code, the code which is readable to humans.
3. If you believe in testing your code. Adonis has solid support for Dependency Injection, which means you can mock dependencies inside your tests.
4. If you believe in writing stable code rather than cool code.

## Do you have plans on using Typescript?

No, not at all. Adonis is about transpiling your code and spending your precious time in writing Type definitions. Tools like http://standardjs.com/ can find ton of errors in your code and rest you can handle inside tests.

## What the heck are Service Providers?

Yeah, you should ask that. Service providers are 3rd party modules, written specifically for Adonis. As now they are written for Adonis, they have access to other modules your application is using via IOC Container. You can read more about them [here](http://adonisjs.com/docs/2.0/service-providers)


## Is it ready for production environment?

Yes, it is but completely depends upon your definition for production environment. Stable releases of Adonis are tested on CentOS and Mac ( we are planning to add Windows server ). 

Also below is the checklist we follow, while writing new features or improving old ones.

1. Should work with LTS release of Node.
2. There are no memory leaks.
3. At-least 95% of code coverage.

Also documentation website of Adonis is written using the framework. We do have over 150k visits a month, which gives us a nice overview of the capabilities of Adonis.