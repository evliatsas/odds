const jwt = require('jsonwebtoken')
const config = require('./config')
const redisClient = require('./redis-client')

module.exports.login = async (req, res) => {
  try {
    let username = req.body.username
    let password = req.body.password
    let storedPassword = null
    if (username && password) {
      const uid = await redisClient.hgetAsync('users', username)
      if (uid) {
        storedPassword = await redisClient.hgetAsync(`user:${uid}`, 'password')
      }
      if (password === storedPassword) {
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
  } catch (error) {
    res.status(500).send(error)
  }
}

module.exports.index = (req, res) => {
  res.json({
    success: true,
    message: 'Index page'
  })
}

module.exports.notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'url not found'
  })
}
