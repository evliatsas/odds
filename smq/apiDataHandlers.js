const redisClient = require('./redis-client')

module.exports.getSports = async (req, res) => {
  try {
    const rawData = await redisClient.smembersAsync('sports')
    return res.send(rawData)
  } catch (error) {
    return res.status(500).send(error)
  }
}

module.exports.getCompetitions = async (req, res) => {
  try {
    const { sport } = req.params
    const rawData = await redisClient.smembersAsync(sport)
    return res.send(rawData)
  } catch (error) {
    return res.status(500).send(error)
  }
}

module.exports.getTeams = async (req, res) => {
  try {
    const { sport, competition } = req.params
    const rawData = await redisClient.smembersAsync(`${sport}:${competition}`)
    return res.send(rawData)
  } catch (error) {
    return res.status(500).send(error)
  }
}
