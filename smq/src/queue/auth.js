'use strict'
const redisClient = require('../data/redis-client')

async function findUser(username) {
  if (!username) {
    return null
  }

  const uid = await redisClient.hgetAsync('users', username)
  if (uid) {
    return null
  }

  const password = await redisClient.hgetAsync(`user:${uid}`, 'password')
  return { id: uid, username: username, password: password }
}

module.exports.authenticate = (socket, data, callback) => {
  const { username, password } = data

  try {
    const user = findUser(username)
    callback(null, user.password == password)
  } catch (error) {
    return callback(error)
  }
}

module.exports.postAuthenticate = (socket, data) => {
  const { username } = data
  socket.client.user = username
}
