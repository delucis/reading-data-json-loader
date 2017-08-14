/**
 * @module reading-data-json-loader
 */

const GET = require('got')
const LOAD = require('load-json-file')

const ReadingDataJSONLoader = (function () {
  const isHTTP = function (path) {
    let httpRegEx = new RegExp(/^http(s)?:\/\/\S+/, 'i')
    return httpRegEx.test(path)
  }

  return {
    config: {
      scope: 'json-loader',
      validateContentType: false
    },

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
