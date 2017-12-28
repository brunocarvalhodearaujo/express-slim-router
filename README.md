express-slim-router
===================

### Usage

````js
import express from 'express'
import router from 'express-slim-router'

const server = express()

router({ cwd: process.cwd() })
  .load('controllers')
  .into((uri, callback) => server.use(uri, callback))

server.listen(3000)
````

### Instalation

````sh
npm install express-slim-router # via npm
````

### Features

  - support for mjs files, class and functions
  - makes mvc easier to work with
