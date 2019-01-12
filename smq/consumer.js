'use strict'

const config = require('./config')
const redisSMQ = require('redis-smq')
const redisClient = require('./redis-client')
const io = require('socket.io')(config.restapi.port)
const redisAdapter = require('socket.io-redis')

io.adapter(
  redisAdapter({
    host: config.smq.redis.host,
    port: config.smq.redis.port
  })
)

const Consumer = redisSMQ.Consumer

class MessageConsumer extends Consumer {
  async consume(message, cb) {
    await redisClient.setAsync(message.d.event.h, JSON.stringify(message))
    io.emit('odd', message)
    cb()
  }
}

MessageConsumer.queueName = 'msg_queue'

const consumer = new MessageConsumer(config.smq)
consumer.run()
console.log('consumer running...')
