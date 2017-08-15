# @delucis/reading-data-json-loader

[![Build Status](https://travis-ci.org/delucis/reading-data-json-loader.svg?branch=master)](https://travis-ci.org/delucis/reading-data-json-loader)
[![Coverage Status](https://coveralls.io/repos/github/delucis/reading-data-json-loader/badge.svg?branch=master)](https://coveralls.io/github/delucis/reading-data-json-loader?branch=master)

A plugin for [`@delucis/reading-data`](https://github.com/delucis/reading-data)
that loads JSON files over the network or from the local file system.


## Installation

```sh
npm install --save @delucis/reading-data-json-loader
```


## Usage

```js
const RD = require('@delucis/reading-data')
const JSON_LOADER = require('@delucis/reading-data-json-loader')

RD.use(JSON_LOADER, {
  scope: 'myJSONFile',
  path: 'https://unpkg.com/@delucis/reading-data/package.json'
})

RD.run().then((res) => {
  console.log(res.data.myJSONFile)
})
```

Using `reading-data-json-loader` to load multiple files

```js
RD.use(JSON_LOADER, {
  scope: [local, github, unpkg]
  path: {
    local: 'package.json',
    github: 'https://raw.githubusercontent.com/delucis/reading-data/master/package.json',
    unpkg: 'https://unpkg.com/@delucis/reading-data/package.json'
  }
})

RD.run().then((res) => {
  for (var key in res.data) {
    console.log(key) // 'local', 'github', 'unpkg'
  }
})
```


## Options

name    | type                 | default       | required? | description
--------|----------------------|---------------|:---------:|-------------------------------------------------------------------------------------------------------------------------------------------
`hooks` | `String`, `Object` |               |           | The `reading-data` hook that should load the JSON file. Can be scoped by passing a object with scopes as keys, hooks as values.
`path`  | `String`, `Object` |               |     ✔︎     | The path or URL of the JSON file to load. Can be an object, where the keys match the scope(s) set in the `scope` option.
`scope` | `String`, `Array`  | 'json-loader' |     ✔︎     | The scope under which `reading-data` will store this plugin’s data. Can be an array to return multiple filepaths/URLs, to multiple scopes.
