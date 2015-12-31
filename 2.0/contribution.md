# Contributing

In favor of active development we accept contributions from everyone. You can contribute by submitting a bug, creating pull requests or even by improving documentation. Below is the guide to be followed strictly
before submitting your pull requests.

- [Coding Style](#coding-style)
- [Git Flow](#git-flow)
- [Philosophy](#philosophy)
- [Help](#help)

## Coding Style

To keep project away from **linting** debates we make use of [Standard Js](http://standardjs.com/), which is really a handy linting tool that enforces strict coding styles and makes sure your files are free from dead code.

Each module of Adonis has bundled `standard` as a dev dependency with registered script inside `package.json` file. In order to lint your code run following command.

```bash,line-numbers
npm run standard
```

## Git Flow

As Adonis is a new kid and growing rapidly we planned to stick to [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). In brief below are rules you need to follow.

1. When you start working, think of a feature or problem you are trying to fix.
2. Fork the repo you are planning to work on.
3. Create a new feature branch from develop branch not master branch. `feature-MYFEATURE`
4. Work on it until you feel comfortable to create a pull request.
5. End this feature and push to your forked repo.
6. Create a pull request of your feature to adonis repo `develop` branch.
7. If all is good we will merge the changes and you are free to delete your `feature-MYFEATURE` branch.

## Philosophy

There is lot more to coding than following the above guidelines. Adonis may seem like a huge framework but it is combination of small tested components. Some of them are written specifically for Adonis, which are known as Service providers, where others are standalone modules called [poppins](https://github.com/poppinss).

While contributing do may sure, the features are requesting to get merged are not bloated. Also never accept configuration directly on your library methods, instead define a file inside `config` directory and read configuration from `Config` provider.

## Help

If you are having trouble getting started with the development of Adonis, feel free to join us on [Gitter](https://gitter.im/adonisjs/adonis-framework/).
