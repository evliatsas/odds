'use strict'

const config = require('../config/config')
const socket = require('socket.io-client')(config.odds.uri)
const { Producer, Message } = require('redis-smq')

const producer = new Producer('archive_queue', config.smq)

socket.on('connect', function() {
  console.log('connect')
  socket.emit('authentication', config.odds.fuzzers)
  socket.on('unauthorized', data => {
    console.log(data)
    closeListener()
  })
  socket.on('authenticated', function() {
    socket.on('bot-data', function(msg) {
      const message = new Message()
      message.setBody(msg)
      producer.produceMessage(message, err => {
        if (err) console.log(err)
      })
    })
  })
})

console.log('archive producer running...')
socket.connect()

function closeListener() {
  socket.disconnect()
  producer.shutdown()
}

process.on('SIGTERM', () => {
  closeListener()
})

process.on('SIGINT', () => {
  closeListener()
})
