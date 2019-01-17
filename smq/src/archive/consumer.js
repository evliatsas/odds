'use strict'

const config = require('../config/config')
const redisSMQ = require('redis-smq')
const MongoClient = require('mongodb').MongoClient
const io = require('socket.io')(config.socket.port)
const redisAdapter = require('socket.io-redis')

io.adapter(
  redisAdapter({
    host: config.smq.redis.host,
    port: config.smq.redis.port
  })
)

const { Consumer } = redisSMQ

class ArchiveConsumer extends Consumer {
  constructor() {
    const url = `mongodb://${config.smq.mongodb.host}:${
      config.smq.mongodb.port
    }`
    const dbName = config.smq.mongodb.database
    const client = new MongoClient(url)
    client.connect(function(err, client) {
      const db = client.db(dbName)
      const archive = db.collection('archive')
    })

    super()
  }

  async consume(message, cb) {
    //calculate unique message key from event data
    const msgKey = `${message.d.event.h}:${message.d.event.g}:${
      message.d.event.competition
    }:${message.d.event.sport}:${new Date().getFullYear()}`

    let count = await archive.count({ key: msgKey })
    const exists = count > 0
    if (exists) {
      //fetch the existing data for the event
      var data = await archive.findOne({ key: msgKey })
      //update the values of the event from the values of the message
      const lastEvent = data.d.events[data.d.events.length - 1]
      if (lastEvent.time !== message.d.event.time) {
        lastEvent.push(message.d.event)
      }
      const lastLive = data.d.lives[data.d.lives.length - 1]
      if (lastLive.time !== message.d.live.time) {
        lastLive.push(message.d.live)
      }
      for (var index in data.d.markets) {
        //data.d.markets[index] = message.d.markets[index]
      }
      data.d.meta.gameSummary = message.d.meta.gameSummary
      //if the event status has changed

      //replace the existing event data
    } else {
      //no existing data for the given event
      //insert the event data from the message
    }

    cb()
  }
}

ArchiveConsumer.queueName = 'archive_queue'

const consumer = new ArchiveConsumer(config.smq)
consumer.run()
console.log('archive consumer running...')
