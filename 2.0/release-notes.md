# Release Notes

Below are the official release notes for every patch and minor release of Adonis. For major releases checkout [Upgrade guide](upgrade-guide).

- [adonis-framework](#adonis-framework)
- [adonis-lucid](#adonis-lucid)
- [adonis-ace](#adonis-ace)

## Adonis Framework

#### [2.0.9](https://github.com/adonisjs/adonis-framework/compare/v2.0.3...v2.0.9) (2016-01-30)


##### Bug Fixes

* **session-manager:** avoiding reparsing of session body ([0d8394d](https://github.com/adonisjs/adonis-framework/commit/0d8394d))


<a name="2.0.8"></a>
## [2.0.8](https://github.com/adonisjs/adonis-framework/compare/v2.0.3...v2.0.8) (2016-01-29)


##### Bug Fixes

* **request:** method is and accepts have been fixed to treat arrays ([9d8e963](https://github.com/adonisjs/adonis-framework/commit/9d8e963))
* **session:** fixed session manager to keep updated session payload within one request #88 ([1fe8b4b](https://github.com/adonisjs/adonis-framework/commit/1fe8b4b)), closes [#88](https://github.com/adonisjs/adonis-framework/issues/88)
* **session:** now list of drivers is set to an empty object by default ([3bb75e0](https://github.com/adonisjs/adonis-framework/commit/3bb75e0))

##### Features

* **middleware:** middleware now accepts runtime parameters ([6907053](https://github.com/adonisjs/adonis-framework/commit/6907053))
* **package:** passing coverage report to coveralls ([579ab3e](https://github.com/adonisjs/adonis-framework/commit/579ab3e))
* **package.json:** make the repository commitizen-friendly ([0082c4a](https://github.com/adonisjs/adonis-framework/commit/0082c4a))
* **request:** add match method to match an array of patterns to current url ([a81a4f7](https://github.com/adonisjs/adonis-framework/commit/a81a4f7))
* **request:** added hasBody and format methods to request instance ([30739db](https://github.com/adonisjs/adonis-framework/commit/30739db))
* **request:** Added raw method to access raw data sent to a given request ([00de598](https://github.com/adonisjs/adonis-framework/commit/00de598))
* **response:** added descriptive methods to make response like ok,unauthorized ([b092407](https://github.com/adonisjs/adonis-framework/commit/b092407))
* **response:** added sendView method to end the response immediately by sending view ([1655667](https://github.com/adonisjs/adonis-framework/commit/1655667))
* **route:** added options to add format to routes ([cfe6c5c](https://github.com/adonisjs/adonis-framework/commit/cfe6c5c))
* **route-resource:** added support for nested resources and resources filters ([907014e](https://github.com/adonisjs/adonis-framework/commit/907014e))
* **routes:** added middleware alias and added support for multiple params ([51cf673](https://github.com/adonisjs/adonis-framework/commit/51cf673))

##### Performance Improvements

* **config:** remove auto-load with require-all for performance ([806aae2](https://github.com/adonisjs/adonis-framework/commit/806aae2))
* **env,file,helpers:** improved initial datatypes to help v8 set hidden classes ([79bd6b4](https://github.com/adonisjs/adonis-framework/commit/79bd6b4))
* **middleware,route,server,session:** improved variables initialization to keep v8 happy ([20080ec](https://github.com/adonisjs/adonis-framework/commit/20080ec))
* **request.format:** added acceptance for request.format ([4ed82c2](https://github.com/adonisjs/adonis-framework/commit/4ed82c2))


#### [2.0.7](https://github.com/adonisjs/adonis-framework/compare/v2.0.3...v2.0.7) (2016-01-17)


##### Bug Fixes

* **request:** method is and accepts have been fixed to treat arrays ([9d8e963](https://github.com/adonisjs/adonis-framework/commit/9d8e963))
* **session:** now list of drivers is set to an empty object by default ([3bb75e0](https://github.com/adonisjs/adonis-framework/commit/3bb75e0))

##### Features

* **package.json:** make the repository commitizen-friendly ([0082c4a](https://github.com/adonisjs/adonis-framework/commit/0082c4a))
* **request:** add match method to match an array of patterns to current url ([a81a4f7](https://github.com/adonisjs/adonis-framework/commit/a81a4f7))
* **request:** Added raw method to access raw data sent to a given request ([00de598](https://github.com/adonisjs/adonis-framework/commit/00de598))

#### 2.0.6 (2016-01-16)

##### docs
* docs: add CONTRIBUTING.md file ([ab7afdb](https://github.com/adonisjs/adonis-framework/commit/ab7afdb))
* docs: update the build badge to get the status from master branch ([9c5c61f](https://github.com/adonisjs/adonis-framework/commit/9c5c61f))

* add trello badge ([7c57fe3](https://github.com/adonisjs/adonis-framework/commit/7c57fe3))
* Config provider now only reads .js files ([dcc7aee](https://github.com/adonisjs/adonis-framework/commit/dcc7aee))
* correct all license date ([9f5fd24](https://github.com/adonisjs/adonis-framework/commit/9f5fd24))
* delete lowercase readme ([6c12f92](https://github.com/adonisjs/adonis-framework/commit/6c12f92))
* Improved tests coverage ([07efb17](https://github.com/adonisjs/adonis-framework/commit/07efb17))
* Merge branch 'master' of github.com:adonisjs/adonis-framework ([2eaa793](https://github.com/adonisjs/adonis-framework/commit/2eaa793))
* Merge branch 'release-2.0.3' into develop ([d5a3cb4](https://github.com/adonisjs/adonis-framework/commit/d5a3cb4))
* Merge branch 'release-2.0.4' ([c4405bf](https://github.com/adonisjs/adonis-framework/commit/c4405bf))
* Merge pull request #42 from alexbooker/patch-1 ([9a2d4be](https://github.com/adonisjs/adonis-framework/commit/9a2d4be))
* Merge pull request #45 from RomainLanz/develop ([643ff72](https://github.com/adonisjs/adonis-framework/commit/643ff72))
* Merge pull request #46 from adonisjs/revert-42-patch-1 ([c7e6471](https://github.com/adonisjs/adonis-framework/commit/c7e6471))
* Merge pull request #47 from RomainLanz/develop ([27cb1d5](https://github.com/adonisjs/adonis-framework/commit/27cb1d5))
* Merge pull request #48 from RomainLanz/develop ([949a06f](https://github.com/adonisjs/adonis-framework/commit/949a06f))
* Merge pull request #61 from RomainLanz/feature/improving-readme ([0dbafa8](https://github.com/adonisjs/adonis-framework/commit/0dbafa8))
* Merge pull request #63 from RomainLanz/update-readme-badges ([c52f989](https://github.com/adonisjs/adonis-framework/commit/c52f989))
* Merge pull request #64 from RomainLanz/update-lodash ([bcaf01a](https://github.com/adonisjs/adonis-framework/commit/bcaf01a))
* Merge pull request #65 from RomainLanz/contributing ([4f5fd0b](https://github.com/adonisjs/adonis-framework/commit/4f5fd0b))
* Merge pull request #67 from RomainLanz/commitizen ([ff6d94f](https://github.com/adonisjs/adonis-framework/commit/ff6d94f))
* Merged release 2.0.5 ([222bab7](https://github.com/adonisjs/adonis-framework/commit/222bab7))
* Moved route resolution to callback method, required for method spoofing ([839791a](https://github.com/adonisjs/adonis-framework/commit/839791a))
* new readme version ([81169c9](https://github.com/adonisjs/adonis-framework/commit/81169c9))
* Now all files are dependent upon config directory and not reading from .env file ([f2ff04f](https://github.com/adonisjs/adonis-framework/commit/f2ff04f))
* Now param method accepts a default value ([adcd7fb](https://github.com/adonisjs/adonis-framework/commit/adcd7fb))
* npm version bump ([0b6693e](https://github.com/adonisjs/adonis-framework/commit/0b6693e))
* npm version bump ([0d6b456](https://github.com/adonisjs/adonis-framework/commit/0d6b456))
* Revert "Updated the licence date" ([102ad50](https://github.com/adonisjs/adonis-framework/commit/102ad50))
* update license date and add license file ([2aa3412](https://github.com/adonisjs/adonis-framework/commit/2aa3412))
* update shields badges ([6e932f5](https://github.com/adonisjs/adonis-framework/commit/6e932f5))
* Updated the licence date ([e881bd6](https://github.com/adonisjs/adonis-framework/commit/e881bd6))

##### feat

* feat(package.json): make the repository commitizen-friendly ([0082c4a](https://github.com/adonisjs/adonis-framework/commit/0082c4a))
* feat(request): add match method to match an array of patterns to current url ([a81a4f7](https://github.com/adonisjs/adonis-framework/commit/a81a4f7))
* feat(request): Added raw method to access raw data sent to a given request ([00de598](https://github.com/adonisjs/adonis-framework/commit/00de598))

##### refactor

* refactor: update lodash to 4.0.0 ([ad1cbdc](https://github.com/adonisjs/adonis-framework/commit/ad1cbdc))
* refactor(response): Capitalized x-powered-by ([ed3d3dc](https://github.com/adonisjs/adonis-framework/commit/ed3d3dc))
* refactor(server): Increased static server priority over route handler ([30cfe41](https://github.com/adonisjs/adonis-framework/commit/30cfe41))
* refactor(session): improved session drivers handling and exposing session manager ([a17a49b](https://github.com/adonisjs/adonis-framework/commit/a17a49b))

#### 2.0.5
- [dcc7aee72442339e23b5e09a39fcc6388973ed3e](https://github.com/adonisjs/adonis-framework/commit/dcc7aee72442339e23b5e09a39fcc6388973ed3e)

  Config provider reads `.js` files only inside `config` directory.

- [adcd7fb143e86f3d5f4455114969a9eb65d54a76](https://github.com/adonisjs/adonis-framework/commit/adcd7fb143e86f3d5f4455114969a9eb65d54a76)

  Request `param` method now takes a default value to return, when original value does not exists.
  ```javascript,line-numbers
    request.param('drink', 'coffee')
  ```

- [949a06f59afea95948ef6baadfeba961f5e7e79e](https://github.com/adonisjs/adonis-framework/commit/949a06f59afea95948ef6baadfeba961f5e7e79e)

  Corrected all license date

- [6e932f5bfbdc9952f45d32557e35c557c57e454c](https://github.com/adonisjs/adonis-framework/commit/6e932f5bfbdc9952f45d32557e35c557c57e454c)

  Updated shields badges

#### 2.0.4

- [f2ff04fcefacbb9674c165c4498b5cfcca235b4b](https://github.com/adonisjs/adonis-framework/commit/f2ff04fcefacbb9674c165c4498b5cfcca235b4b)

  Now all modules or providers, reads the value from the Config store and do not access the `.env` variables directly. Also introduced settings
  for static resources, trustProxy, jsonP and subdomains.

#### 2.0.3

- [e3244eb8334e0a8c8ffdb38c82cca13c06fe7c9e](https://github.com/adonisjs/adonis-framework/commit/e3244eb8334e0a8c8ffdb38c82cca13c06fe7c9e)
- [cc37815451ae348193e66c6caec62ebfc748dccb](https://github.com/adonisjs/adonis-framework/commit/cc37815451ae348193e66c6caec62ebfc748dccb)
- [bb92ed3c469cd24cf45a78ac0529d6438b2503d6](https://github.com/adonisjs/adonis-framework/commit/bb92ed3c469cd24cf45a78ac0529d6438b2503d6)

## Adonis Lucid

#### 2.0.5
* **model-create:** fixed #16, where returning statement is required for postgres ([fe04529](https://github.com/adonisjs/adonis-lucid/commit/fe04529)), closes [#16](https://github.com/adonisjs/adonis-lucid/issues/16)


#### 2.0.3/2.0.4
* fix(schema): Fixed #15 issue to define multiple schema actions ([610bb33](https://github.com/adonisjs/adonis-lucid/commit/610bb33)), closes [#15](https://github.com/adonisjs/adonis-lucid/issues/15)

#### 2.0.2

- [49aef829dacf6d05722349ca88a758957c9cf329](https://github.com/adonisjs/adonis-lucid/commit/49aef829dacf6d05722349ca88a758957c9cf329)

  Made `--create` and `--table` flags optional.

- [2ef69f8176d8c1a4cdef1d0bef455808f7ac5b13](https://github.com/adonisjs/adonis-lucid/commit/2ef69f8176d8c1a4cdef1d0bef455808f7ac5b13)

  1. Migrations now read only `.js` files inside the migrations directory.
  2. Added support for additional flags with `migration:make` command. It now accepts `--create` and `--table` flags.
  3. On the basis of above flags `migration:make` will have some setup code inside the generated migration file.

#### 2.0.1

- [9092a4e37396fdf86bdfe91cc975ea1dad27a2f1](https://github.com/adonisjs/adonis-lucid/commit/9092a4e37396fdf86bdfe91cc975ea1dad27a2f1)

  Made changes required by latest version of ace


## Adonis ace

#### 2.0.6/2.0.7

##### fix

* fix(ace-runner): Ace commands now exit the process when a command fails ([62a9a54](https://github.com/adonisjs/ace/commit/62a9a54))
* fix(commands-store): Fixed failing test caused by newer version of ioc container ([e800064](https://github.com/adonisjs/ace/commit/e800064))

#### 2.0.5

- [1fb6c7bfac4e62f7e1889727e28a15faa3aeee96](https://github.com/adonisjs/ace/commit/1fb6c7bfac4e62f7e1889727e28a15faa3aeee96)

Setting up default value of options and arguments to null instead of empty string

#### 2.0.4

- [adb4ebd1213875008f0e80160ad678e1e37ea492](https://github.com/adonisjs/ace/commit/adb4ebd1213875008f0e80160ad678e1e37ea492)

Instead of resolving the command, now getting the command while making help screen for a single command.

#### 2.0.3

- [01269867f1352fc94cc1861b3908ec17acabd799](https://github.com/adonisjs/ace/commit/01269867f1352fc94cc1861b3908ec17acabd799)

  Renamed console to ansi due to conflicts with system log

#### 2.0.2

- [b2c4cc6076ea48105b5e46aaa71dd1749ef05c4b](https://github.com/adonisjs/ace/commit/b2c4cc6076ea48105b5e46aaa71dd1749ef05c4b)

  Fixed badges url

- [27044db7961f9f8b72eadabdfff1d748a9377f73](https://github.com/adonisjs/ace/commit/27044db7961f9f8b72eadabdfff1d748a9377f73)

  Making sure to remove the -- from flags/options when passing them to the `handle` method of flag.
