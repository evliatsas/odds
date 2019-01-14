const redisClient = require('./redis-client')

module.exports.getSports = async (req, res) => {
  try {
    const rawData = await redisClient.smembersAsync('sports')
    return res.send(rawData)
  } catch (error) {
    return res.status(500).send(error)
  }
}
