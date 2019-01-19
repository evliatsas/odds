'use strict'

const config = require('../config/config')
const { MongoClient } = require('mongodb')
const dbName = config.smq.mongodb.database
const url = `mongodb://${config.smq.mongodb.host}:${
  config.smq.mongodb.port
}/${dbName}`
const client = new MongoClient(url, { useNewUrlParser: true })

//fetch the archived data for a given event key
module.exports.getEvents = async (req, res) => {
  try {
    client.connect(async (err, client) => {
      const db = client.db(dbName)
      const archive = db.collection('archive')
      const { key } = req.params
      //fetch the archived entries from the db
      const cursor = await archive.find({ key: key })
      const result = await cursor.toArray()
      //serialize the message data markets to JSON from string
      var entries = result.map(function(entry) {
        entry.markets = JSON.parse(entry.markets)
        return entry
      })

      return res.json(entries)
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}
