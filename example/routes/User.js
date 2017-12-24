const { Router } = require('express')

exports.User = class User {
  get (request, response) {
    response.json({ working: true })
  }

  didMount () {
    return Router()
      .get('/:id?', this.get.bind(this))
  }
}
