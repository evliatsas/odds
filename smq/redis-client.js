'use strict'

const config = require('./config')
const redis = require('redis')
const { promisify } = require('util')

const host = config.smq.redis.host
const port = config.smq.redis.port
const uri = `redis://${host}:${port}`
const client = redis.createClient(uri)

module.exports = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  keysAsync: promisify(client.keys).bind(client)
}
