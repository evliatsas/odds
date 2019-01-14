const config = require('./config')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')
const rfs = require('rotating-file-stream')
const app = express()
const middleware = require('./authMiddleware')
const handlers = require('./apiMainHandlers')
const dataHandlers = require('./apiDataHandlers')

var accessLogStream = rfs('access.log', {
  interval: '1d',
  path: path.join(__dirname, 'logs')
})

app.use(morgan('combined', { stream: accessLogStream }))

app.use(
  bodyParser.json({
    limit: '20mb'
  })
)
app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true
  })
)
app.use(cors())
app.use(compression())
app.use(helmet())

app.post('/login', handlers.login)
app.get('/sports', middleware.checkToken, dataHandlers.getSports)
app.get('/', handlers.index)
app.use('*', handlers.notFoound)

const server = app.listen(config.restapi.port, function(err) {
  if (err) {
    throw err
  }
  console.log('API Up and running on port ' + config.restapi.port)
})