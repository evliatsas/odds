require('dotenv').config()
const app = require('express')()
const http = require('http').Server(app)
const redisClient = require('./redis-client')
let conf = require('./socket-client-config')('fuzzers')
var io = require('socket.io')(http)
const socket = require('socket.io-client')(process.env.SOCKET)

io.on('connection', function(socket) {
  console.log('a user connected')
})

app.get('/store/:key', async (req, res) => {
  const { key } = req.params
  const value = req.query
  await redisClient.setAsync(key, JSON.stringify(value))
  return res.send('Success')
})
app.get('/:key', async (req, res) => {
  const { key } = req.params
  const rawData = await redisClient.getAsync(key)
  return res.json(JSON.parse(rawData))
})

const PORT = process.env.PORT || 5000
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

socket.on('connect', function() {
  console.log('connect')
  socket.emit('authentication', conf)
  socket.on('unauthorized', data => {
    console.log(data)
  })
  socket.on('authenticated', function() {
    console.log('authenticated')
    socket.on('disconnect', function(data) {
      console.log('disconnect', data)
    })
    socket.on('bot-data', function(data) {
      //console.log(data)
    })
  })
})

socket.connect()
