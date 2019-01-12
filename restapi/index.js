const config = require('./config')
const app = require('express')()
const http = require('http').Server(app)
const redisClient = require('./redis-client')

const io = require('socket.io')(config.socket.port)
const redisAdapter = require('socket.io-redis')

io.adapter(
  redisAdapter({
    host: config.redis.host,
    port: config.redis.port
  })
)

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

io.on('odd', function(msg) {
  console.log(msg)
})

const PORT = config.api.port
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
