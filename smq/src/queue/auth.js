'use strict'
const redisClient = require('../data/redis-client')

async function findUser(username) {
  try {
    if (!username) {
      return null
    }

    const uid = await redisClient.hgetAsync('users', username)
    if (!uid) {
      return null
    }

    const password = await redisClient.hgetAsync(`user:${uid}`, 'password')
    return { id: uid, username: username, password: password }
  } catch (error) {
    throw error
  }
}

module.exports.authenticate = (socket, data, callback) => {
  const { username, password } = data
  findUser(username)
    .then(user => {
      callback(null, user.password == password)
    })
    .catch(error => {
      return callback(error)
    })
}

module.exports.postAuthenticate = (socket, data) => {
  const { username } = data
  socket.client.user = username
}
