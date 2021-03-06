'use strict'

const config = require('../config/config')
const msgHelper = require('../data/message-helper')
const redisSMQ = require('redis-smq')
const { MongoClient } = require('mongodb')

const Consumer = redisSMQ.Consumer

class ArchiveConsumer extends Consumer {
  async consume(message, cb) {
    //calculate unique message key from event data
    const msgKey = msgHelper.generateKey(message)

    //create an archive entry for the message
    //add key and timestamp
    //serialize message data markets to a string, due to '.' constrain in property keys of MongoDB
    const entry = {
      key: msgKey,
      timestamp: new Date(),
      event: message.d.event,
      markets: JSON.stringify(message.d.markets),
      meta: message.d.meta,
      live: message.d.live
    }
    try {
      //insert the archive entry to the db
      await this.archive.insertOne(entry)
    } catch (err) {
      console.log(err)
    }

    cb()
  }

  //initialize the mongo db client and the archive collection reference
  initMongoClient() {
    const { host, port, database } = config.smq.mongodb
    const url = `mongodb://${host}:${port}/${database}`

    const client = new MongoClient(url, { useNewUrlParser: true })
    client.connect((err, client) => {
      const db = client.db(database)
      this.archive = db.collection('archive')

      //ensure proper indexes
      this.archive.createIndex({ key: 1 })
      this.archive.createIndex({ timestamp: -1 })
    })
  }
}

ArchiveConsumer.queueName = 'archive_queue'

const consumer = new ArchiveConsumer(config.smq)
consumer.initMongoClient()
consumer.run()
console.log('archive consumer running...')
