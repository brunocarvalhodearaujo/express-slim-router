express-slim-router
===================

### Usage

````js
const express = require('express')
const router = require('router')

express()
  .use(router(`${__dirname}/routes`))
  .listen(3000)
````

Check out the [example folder](./example) for more!

### Instalation

````sh
npm install express-slim-router # via npm
yarn add express-slim-router # via yarn
````

### Features

  - autoload es6 class or functions
  - makes MVC applications easier to work with
