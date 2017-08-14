'use strict'

const DESCRIBE = require('mocha').describe
const BEFORE_EACH = require('mocha').beforeEach
const IT = require('mocha').it
const EXPECT = require('chai').expect
const READING_DATA = require('@delucis/reading-data')
const RD_JSON_LOADER = require('../index')

BEFORE_EACH(function () {
  READING_DATA.uninstall()
})

DESCRIBE('ReadingDataJSONLoader', function () {
  this.timeout(20000)

  IT('should be an object', function () {
    EXPECT(RD_JSON_LOADER).to.be.an('object')
  })

  IT('should throw an error if not configured with a path', async function () {
    let testScope = 'noPathTest'
    READING_DATA.use(RD_JSON_LOADER, {
      scope: testScope
    })
    try {
      await READING_DATA.run()
    } catch (e) {
      EXPECT(e).to.be.an('error')
    }
  })

  IT('should throw an error if passed an invalid path', async function () {
    let path = 256
    let testScope = 'invalidPathIsANumber'
    READING_DATA.use(RD_JSON_LOADER, {
      scope: testScope,
      path
    })
    try {
      await READING_DATA.run()
    } catch (e) {
      EXPECT(e).to.be.an('error')
    }
  })

  IT('should load a remote JSON file over HTTPS', async function () {
    let path = 'https://raw.githubusercontent.com/delucis/reading-data/master/package.json'
    let testScope = 'secureGithubPackageJSONTest'
    READING_DATA.use(RD_JSON_LOADER, {
      scope: testScope,
      path
    })
    await READING_DATA.run()
    EXPECT(READING_DATA.data).to.have.property(testScope)
  })

  IT('should load a remote JSON file over HTTP', async function () {
    let path = 'http://chrisswithinbank.net/assets/eventdata.json'
    let testScope = 'csnetJSONTest'
    READING_DATA.use(RD_JSON_LOADER, {
      scope: testScope,
      path
    })
    await READING_DATA.run()
    EXPECT(READING_DATA.data).to.have.property(testScope)
  })

  IT('should follow a 301 redirect', async function () {
    let path = 'http://raw.githubusercontent.com/delucis/reading-data/master/package.json'
    let testScope = 'redirectToGithubPackageJSONTest'
    READING_DATA.use(RD_JSON_LOADER, {
      scope: testScope,
      path
    })
    await READING_DATA.run()
    EXPECT(READING_DATA.data).to.have.property(testScope)
  })

  IT('should load multiple paths to multiple scopes', async function () {
    let testScope1 = 'multiScopeSecureGithubPackageJSONTest'
    let testScope2 = 'multiScopeCsnetJSONTest'
    let testScopes = [testScope1, testScope2]
    let path = {
      [testScope1]: 'https://raw.githubusercontent.com/delucis/reading-data/master/package.json',
      [testScope2]: 'http://chrisswithinbank.net/assets/eventdata.json'
    }
    READING_DATA.use(RD_JSON_LOADER, {
      scope: testScopes,
      path
    })
    await READING_DATA.run()
    for (let scope of testScopes) {
      EXPECT(READING_DATA.data).to.have.property(scope)
    }
  })

  IT('should throw an error if loading a non-JSON resource', async function () {
    let testScope = 'nonJsonURITest'
    let path = 'https://github.com'
    READING_DATA.use(RD_JSON_LOADER, {
      scope: testScope,
      path
    })
    try {
      await READING_DATA.run()
    } catch (e) {
      EXPECT(e).to.be.an('error')
    }
  })
})
