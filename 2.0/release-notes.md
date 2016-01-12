# Release Notes

Below are the official release notes for every patch and minor release of Adonis. For major releases checkout [Upgrade guide](upgrade-guide).

- [adonis-framework](#adonis-framework)
- [adonis-lucid](#adonis-lucid)
- [adonis-ace](#adonis-ace)

## Adonis Framework

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
