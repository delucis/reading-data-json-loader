/**
 * @module reading-data-json-loader
 */

const HTTP = require('http')
const HTTPS = require('https')
const { URL } = require('url')

const ReadingDataJSONLoader = (function () {
  let get = function (urlString, config) {
    let url = new URL(urlString)
    let get = url.protocol === 'https:' ? HTTPS.get : HTTP.get
    return new Promise(function (resolve, reject) {
      get(url, (res) => {
        const { statusCode, headers } = res
        const contentType = headers['content-type']
        let error
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`)
        } else if (config.validateContentType && !/^application\/json/.test(contentType)) {
          error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`)
        }
        if (error) {
          console.error(error.message)
          res.resume() // consume response data to free up memory
          return
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData)
            resolve(parsedData)
          } catch (e) {
            reject('Failed to parse response as JSON.\n' + e)
          }
        })
      })
    })
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
      try {
        let json = await get(path, config)
        return json
      } catch (e) {
        throw new Error('ReadingDataJSONLoader#fetch(): ' + e)
      }
    }
  }
}())

module.exports = ReadingDataJSONLoader

