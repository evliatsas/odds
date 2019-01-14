let jwt = require('jsonwebtoken')
let config = require('./config')

module.exports.login = (req, res) => {
  let username = req.body.username
  let password = req.body.password

  // For the given username fetch user from DB
  let mockedUsername = 'admin'
  let mockedPassword = 'password'

  if (username && password) {
    if (username === mockedUsername && password === mockedPassword) {
      let token = jwt.sign({ username: username }, config.token.secret, {
        expiresIn: '24h'
      })
      res.status(200).json({
        success: true,
        message: 'Authentication successful!',
        token: token
      })
    } else {
      res.status(403).json({
        success: false,
        message: 'Incorrect username or password'
      })
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Authentication failed! Please check the request'
    })
  }
}

module.exports.index = (req, res) => {
  res.json({
    success: true,
    message: 'Index page'
  })
}

module.exports.notFoound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'url not found'
  })
}
