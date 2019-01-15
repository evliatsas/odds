const redisClient = require('../data/redis-client')

//fetch the members of the sports set list
module.exports.getSports = async (req, res) => {
  try {
    const rawData = await redisClient.smembersAsync('sports')
    return res.send(rawData)
  } catch (error) {
    return res.status(500).send(error)
  }
}

//fetch the competitions list for a given sport
module.exports.getCompetitions = async (req, res) => {
  try {
    const { sport } = req.params
    const rawData = await redisClient.smembersAsync(sport)
    return res.send(rawData)
  } catch (error) {
    return res.status(500).send(error)
  }
}

//fetch the teams list for a given competition of a specific sport
module.exports.getTeams = async (req, res) => {
  try {
    const { sport, competition } = req.params
    const rawData = await redisClient.smembersAsync(`${sport}:${competition}`)
    return res.send(rawData)
  } catch (error) {
    return res.status(500).send(error)
  }
}

//fetch the status enumeration list
module.exports.getStatuses = async (req, res) => {
  try {
    const rawData = await redisClient.smembersAsync('statuses')
    return res.send(rawData)
  } catch (error) {
    return res.status(500).send(error)
  }
}

//fetch the events with the given status
module.exports.getEventsPerStatus = async (req, res) => {
  try {
    const { status } = req.params
    const rawData = await redisClient.smembersAsync(status)
    return res.send(rawData)
  } catch (error) {
    return res.status(500).send(error)
  }
}

//fetch an events data by key
module.exports.getEvent = async (req, res) => {
  try {
    const { key } = req.params
    const rawData = await redisClient.getAsync(key)
    return res.send(rawData)
  } catch (error) {
    return res.status(500).send(error)
  }
}
