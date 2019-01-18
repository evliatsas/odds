'use strict'

const config = require('../config/config')
const redisSMQ = require('redis-smq')
const { MongoClient } = require('mongodb')
const redisAdapter = require('socket.io-redis')

const { Consumer } = redisSMQ

class ArchiveConsumer extends Consumer {
  constructor() {
    const dbName = config.smq.mongodb.database
    const url = `mongodb://${config.smq.mongodb.host}:${
      config.smq.mongodb.port
    }/${dbName}`

    const client = new MongoClient(url, { useNewUrlParser: true })
    client.connect((err, client) => {
      const db = client.db(dbName)
      this.archive = db.collection('archive')
    })

    super()
  }

  async consume(message, cb) {
    //calculate unique message key from event data
    const msgKey = `${message.d.event.h}:${message.d.event.g}:${
      message.d.event.competition
    }:${message.d.event.sport}:${new Date().getFullYear()}`

    const entry = {
      key: msgKey,
      timestamp: new Date(),
      message: JSON.stringify(message)
    }
    try {
      await this.archive.insertOne(entry)
    } catch (err) {
      console.log(err)
    }

    cb()
  }
}

ArchiveConsumer.queueName = 'archive_queue'

const consumer = new ArchiveConsumer(config.smq)
consumer.run()
console.log('archive consumer running...')
