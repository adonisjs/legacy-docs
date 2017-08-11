'use strict'

const ace = use('@adonisjs/ace')
const path = use('path')
const klaw = use('klaw')
const through2 = use('through2')
const Helpers = use('Helpers')
const Env = use('Env')
const matter = use('gray-matter')
const watchFn = use('node-watch')
const _ = use('lodash')
const bs = require("browser-sync").create()
const { Command } = ace

class CompileDoc extends Command {
  constructor () {
    super()
    this.contentDir = path.join(Helpers.appRoot(), 'content')
    this.menuFile = Helpers.tmpPath('menu.json')
  }

  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return 'compile:docs {-w, --watch : Watch files}'
  }

  /**
   * The command description
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'Compile docs and generate a menu file'
  }

  /**
   * Returns an array of all the paths for the docs
   * file.
   *
   * @method _getPathsForDocs
   *
   * @return {Array}
   *
   * @private
   */
  _getPathsForDocs () {
    return new Promise((resolve, reject) => {
      const files = []
      klaw(this.contentDir)
      .pipe(through2.obj(function (item, enc, next) {
        if (!item.stats.isDirectory() && item.path.endsWith('.adoc')) {
          this.push(item)
        }
        next()
      }))
      .on('data', (item) => (files.push(item.path)))
      .on('end', () => resolve(files))
      .on('error', reject)
    })
  }

  /**
   * Returns the meta data for a doc file by parsing
   * the yaml front matter
   *
   * @method _getMetaFor
   *
   * @param  {String}    forFile
   *
   * @return {Object}
   *
   * @private
   */
  async _getMetaFor (forFile) {
    const content = await this.readFile(forFile, 'utf-8')
    const frontMatter = matter(content).data
    frontMatter.path = forFile
    return frontMatter
  }

  /**
   * Save the menu file with changes
   *
   * @method _saveMenuFile
   *
   * @param  {Array}      docsMeta
   *
   * @return {void}
   *
   * @private
   */
  async _saveMenuFile (docsMeta) {
    const orderedMeta = _.orderBy(docsMeta, 'path', 'asc')
    await this.writeFile(this.menuFile, JSON.stringify(docsMeta, null, 2))
  }

  /**
   * Returns the relative path of the file
   *
   * @method _getFilePath
   *
   * @param  {String}     absPath
   *
   * @return {String}
   *
   * @private
   */
  _getFilePath (absPath) {
    return absPath.replace(this.contentDir, '')
  }

  /**
   * Watch for changes and update the menu file
   *
   * @method watch
   *
   * @return {void}
   */
  watch () {
    console.log('Watching files for changes ...  \n')
    const menuJson = require(this.menuFile)

    /**
     * Initiate browser sync
     */
    bs.init({
      proxy: `http://${Env.get('HOST')}:${Env.get('PORT')}`
    })

    watchFn(this.contentDir, { recursive: true }, async (evt, name) => {
      if (evt == 'update') {
        console.log(`${this.chalk.magenta('changed:   ')} ${this._getFilePath(name)}`)
        const updatedMeta = await this._getMetaFor(name)

        /**
         * find a patch existing menu if file was
         * updated
         */
        const menuItem = _.find(menuJson, (item) => {
          if (item.path === name) {
            _.each(updatedMeta, (val, key) => {
              item[key] = updatedMeta[key]
            })
            return true
          }
        })

        /**
         * Push to menu array if a new file
         */
        if (!menuItem) {
          menuJson.push(updatedMeta)
        }

        await this._saveMenuFile(menuJson)
        bs.reload()
        return
      }

      if (evt === 'remove') {
        this.error(`${this._getFilePath(name)} file removed`)
        _.remove(menuJson, (item) => item.path === name)
        await this._saveMenuFile(menuJson)
        bs.reload()
      }
    })
  }

  /**
   * The method executed when command is called
   *
   * @method handle
   *
   * @param  {Object} args
   * @param  {Boolean} options.watch
   *
   * @return {void}
   */
  async handle (args, { watch }) {
    const docs = await this._getPathsForDocs()
    const docsMeta = await Promise.all(docs.map((doc) => this._getMetaFor(doc)))
    await this._saveMenuFile(docsMeta)
    this.success(`${this.icon('success')} Generated menu file`)

    if (watch) {
      this.watch()
    }
  }
}

module.exports = CompileDoc
