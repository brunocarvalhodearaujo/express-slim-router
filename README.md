express-slim-router
===================

### Usage

````js
import express from 'express'
import router from 'express-slim-router'

const app = express()

router({ cwd: process.cwd() })
  .load('controllers')
  .into(app)

app.listen(3000)
````

### Instalation

````sh
npm install express-slim-router # via npm
````

### Features

  - support for mjs files, class and functions
  - makes mvc easier to work with
