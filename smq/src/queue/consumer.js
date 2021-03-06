'use strict'

const config = require('../config/config')
const redisSMQ = require('redis-smq')
const redisClient = require('../data/redis-client')
const msgHelper = require('../data/message-helper')
const http = require('http')
const io = require('socket.io')
const redisAdapter = require('socket.io-redis')
const auth = require('./auth')

var server = http.createServer()
server.listen(config.socket.port, config.socket.ipAddress)
const socket = io.listen(server)
socket.adapter(
  redisAdapter({
    host: config.smq.redis.host,
    port: config.smq.redis.port
  })
)

require('socketio-auth')(socket, {
  authenticate: auth.authenticate,
  postAuthenticate: auth.postAuthenticate,
  timeout: 1000
})

const { Consumer } = redisSMQ

class MessageConsumer extends Consumer {
  async consume(message, cb) {
    //calculate unique message key from event data
    const msgKey = msgHelper.generateKey(message)

    const exists = await redisClient.existsAsync(msgKey)
    if (exists) {
      //fetch the existing data for the event
      const rawData = await redisClient.getAsync(msgKey)
      //update the values of the event from the values of the message
      var data = JSON.parse(rawData)
      data.d.event.time = message.d.event.time
      data.d.event.tp = message.d.event.tp
      data.d.event.type = message.d.event.type
      for (var index in message.d.live) {
        data.d.live[index] = message.d.live[index]
      }
      for (var index in message.d.markets) {
        data.d.markets[index] = message.d.markets[index]
      }
      data.d.meta.gameSummary = message.d.meta.gameSummary
      //if the event status has changed
      if (data.d.meta.gameStatus !== message.d.meta.gameStatus) {
        //remove event key from the previous status set
        await this.removeFromStatusSet(data.d.meta.gameStatus, msgKey)
        //add event key to the current status set
        await this.assignToStatusSet(data.d.meta.gameStatus, msgKey)

        data.d.meta.gameStatus = message.d.meta.gameStatus
      }
      //replace the existing event data
      await redisClient.setAsync(msgKey, JSON.stringify(data))
      //emit the updated event
      socket.emit('odd', data)
    } else {
      //no existing data for the given event
      //insert the event data from the message
      await redisClient.setAsync(msgKey, JSON.stringify(message))
      //add the new event to the event status SET
      await this.assignToStatusSet(message.d.meta.gameStatus, msgKey)
      // Update lists of sports, competitions and teams
      await this.addToSportList(message)
      //emit the new event
      socket.emit('odd', message)
    }

    cb()
  }

  //add event to the sport list
  async addToSportList(message) {
    //add to sports set list
    await redisClient.saddAsync('sports', message.d.event.sport)
    //add competition to the sport set list
    await redisClient.saddAsync(
      message.d.event.sport,
      msgHelper.cleanString(message.d.event.competition)
    )
    //add home team to the sport/competition team list
    await redisClient.saddAsync(
      msgHelper.cleanString(
        `${message.d.event.sport}:${message.d.event.competition}`
      ),
      msgHelper.cleanString(message.d.event.h)
    )
    //add guest team to the sport/competition team list
    await redisClient.saddAsync(
      msgHelper.cleanString(
        `${message.d.event.sport}:${message.d.event.competition}`
      ),
      msgHelper.cleanString(message.d.event.g)
    )
  }

  //assign event to its current status set
  async assignToStatusSet(status, msgKey) {
    //make sure that the status is in the overall statuses enumeration list
    await redisClient.saddAsync('statuses', status)
    //add the event to the proper events per status list
    await redisClient.saddAsync(status, msgKey)
  }

  //remove event from its previous status list
  async removeFromStatusSet(status, msgKey) {
    await redisClient.sremAsync(status, msgKey)
  }
}

MessageConsumer.queueName = 'msg_queue'

const consumer = new MessageConsumer(config.smq)
consumer.run()
console.log('consumer running...')
