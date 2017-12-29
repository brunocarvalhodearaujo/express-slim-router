express-slim-router
===================

### Usage

````js
import express from 'express'
import router from 'express-slim-router'

const server = express()

const routes = express.Router()
router({ cwd: process.cwd() })
  .load('controllers')
  .into(routes)

server.use('/', routes)
server.listen(3000)
````

### Instalation

````sh
npm install express-slim-router # via npm
````

### Features

  - support for mjs files, class and functions
  - makes mvc easier to work with
