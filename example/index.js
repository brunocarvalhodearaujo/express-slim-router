const express = require('express')
const router = require('../src')

express()
  .use(router(`${__dirname}/routes`).on('mount', () => console.log('dsoakdask')))
  .listen(process.env.PORT || 3000)
