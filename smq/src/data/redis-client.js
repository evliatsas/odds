'use strict'

const config = require('../config/config')
const redis = require('redis')
const { promisify } = require('util')

const { host, port } = config.smq.redis
const uri = `redis://${host}:${port}`
const client = redis.createClient(uri)

module.exports = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  incrAsync: promisify(client.incr).bind(client),
  keysAsync: promisify(client.keys).bind(client),
  existsAsync: promisify(client.exists).bind(client),
  lpushAsync: promisify(client.lpush).bind(client),
  saddAsync: promisify(client.sadd).bind(client),
  sismemberAsync: promisify(client.sismember).bind(client),
  sremAsync: promisify(client.srem).bind(client),
  smembersAsync: promisify(client.smembers).bind(client),
  hmgetAsync: promisify(client.hmget).bind(client),
  hmsetAsync: promisify(client.hmset).bind(client),
  hgetAsync: promisify(client.hget).bind(client),
  hsetAsync: promisify(client.hset).bind(client),
  hexistsAsync: promisify(client.hexists).bind(client)
}
