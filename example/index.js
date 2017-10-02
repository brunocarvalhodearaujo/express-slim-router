import express from 'express'
import router from 'express-slim-router'

export default express()
  .use(router(`${__dirname}/routes`))
  .listen(process.env.PORT || 3000)
