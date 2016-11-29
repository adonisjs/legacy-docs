---
title: Community
permalink: community
description: AdonisJs help, IRC, and the guidelines
categories:
- prologue
---

{{TOC}}

All Open Source projects are maintained and backed by a vibrant community of users and collaborators. We are friendly and discuss very topic and issues on given channels.

1. [Github](https://github.com/adonisjs) - Share bugs on dedicated repos of AdonisJs. Try to help us with the exact issue and required steps/code to reproduce that issue.
2. [Gitter](https://gitter.im/adonisjs/adonis-framework) - Here we discuss common topics. Feel free to jump in and share your views.
3. [Trello](https://trello.com/b/yzpqCgdl/adonis-for-humans) - The Roadmap of AdonisJs. We try to keep it updated with the plans and features that are about to come into AdonisJS.
4. [Twitter](https://twitter.com/adonisframework) - The official twitter channel to stay updated with the progress we make each day.

## Submitting Issues

Always try to descriptive when submitting issues/bugs. Provide enough context and information to reproduce the issue.

1. Share the version of the framework you are on. AdonisJs is a combination of several sub-modules and you can find the versions of those submodules inside your project `package.json` file.
2. Instead of mentioning `X` is not working, try to share the code snippets.
3. A sample repo with the code to reproduce the issue will be extremely helpful.

## Coding Style

Javascript has a handful of linters to keep your coding style consistent. We make use of [StandardJs](http://standardjs.com/). It is a non-configurable module which makes it so easy to stick to a consistent style instead of configuring styles.

Each module of AdonisJs installs **StandardJs** as a development dependency. So before submitting your PR's, make sure to lint your code.

```bash
npm run lint
```


## Git Flow

We make use of [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) to work on new features and manage releases. Below are the rules we follow every day.

1. When you start working, think of a feature or problem you are trying to fix.
2. Fork the repo you are planning to work on.
3. Create a new feature branch (feature-MYFEATURENAME) from **develop branch**, not master branch.
4. Work on it until you feel comfortable to create a pull request.
5. End this feature and push to your forked repo.
6. Create a pull request of your feature to AdonisJs repo develop branch.
7. If all is good we will merge the changes and you are free to delete your **feature-MYFEATURENAME** branch.
