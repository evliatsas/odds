const redisClient = require('./redis-client')

const users = [
  { username: 'admin', password: 'password' },
  { username: 'user', password: 'password' }
]

module.exports.feed = async () => {
  try {
    users.forEach(async u => {
      const b = await redisClient.hexistsAsync('users', u.username)
      if (b == 0) {
        const id = await redisClient.incrAsync('next_user_id')
        await redisClient.hmsetAsync(
          `user:${id}`,
          'username',
          u.username,
          'password',
          u.password
        )
        await redisClient.hsetAsync('users', u.username, id)
      }
    })
    console.log('Data initialized.')
  } catch (error) {
    console.log('Error initializing data')
    console.log(error)
  }
}
