/**
 * @module reading-data-json-loader
 */

const GET = require('got')
const LOAD = require('load-json-file')

const ReadingDataJSONLoader = (function () {
  /**
   * Test whether a string begins with `http://` or `https://`.
   *
   * @memberof module:reading-data-json-loader
   * @private
   *
   * @param  {String} path The string to test.
   * @return {Boolean}     `true` if `path` starts with `http://` or `https://`, otherwise `false`.
   *
   * @since 0.0.1
   */
  const isHTTP = function (path) {
    let httpRegEx = new RegExp(/^http(s)?:\/\/\S+/, 'i')
    return httpRegEx.test(path)
  }

  return {
    /**
     * Plugin configuration object.
     * @type {Object}
     * @property {String|Array} scope='json-loader' The scope(s) for which this plugin will return data.
     * @property {String|Object} path               The path(s) of JSON files to load.
     *
     * @since 0.0.1
     */
    config: {
      scope: 'json-loader'
    },

    /**
     * Load a JSON file either from the file system or via an HTTP(S) request
     * and return its contents as an object.
     *
     * @param  {Object} pluginContext
     * @param  {Object} pluginContext.config The configuration object for this plugin.
     * @param  {String} pluginContext.scope  The specific scope for which this fetch method is being called.
     * @return {Object} Data retrieved from the JSON file.
     *
     * @since 0.0.1
     */
    fetch: async function ({config, scope}) {
      if (!config.hasOwnProperty('path')) {
        throw new Error('ReadingDataJSONLoader#fetch(): expected config to have property path.')
      }
      let path
      if (typeof config.path === 'string') {
        path = config.path
      } else if (typeof config.path === 'object' && config.path.hasOwnProperty(scope)) {
        path = config.path[scope]
      } else {
        throw new Error('ReadingDataJSONLoader#fetch(): expected config.path to be a string or an object with scope "' + scope + '".')
      }
      if (isHTTP(path)) {
        try {
          let res = await GET(path, { json: true })
          let json = res.body
          return json
        } catch (e) {
          throw new Error('ReadingDataJSONLoader#fetch(): ' + e)
        }
      } else {
        let json = await LOAD(path)
        return json
      }
    }
  }
}())

module.exports = ReadingDataJSONLoader
