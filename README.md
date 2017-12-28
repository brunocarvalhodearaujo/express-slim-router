express-slim-router
===================

### Usage

````js
import express from 'express'
import router from 'express-slim-router'

const app = express()

router({ cwd: __dirname })
  .load('controllers')
  .into(server)

app.listen(3000)
````

### Instalation

````sh
npm install express-slim-router # via npm
yarn add express-slim-router # via yarn
````

### Features

  - autoload es6 class or functions
  - makes MVC applications easier to work with
