require('dotenv').config()
const app = require('express')()
const server = require('http').createServer(app)
const redisClient = require('./redis-client')

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

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
