const config = require('../config/config')
const MongoClient = require('mongodb').MongoClient

class Connection {
    static connectToMongo() {
        if ( this.db ) return Promise.resolve(this.db)
        return MongoClient.connect(this.url, this.options)
            .then(db => this.db = db)
    }
}

Connection.db = null
Connection.url = `mongodb://${config.smq.mongodb.host}:${config.smq.mongodb.port}/${config.smq.mongodb.database}`
Connection.options = {
    bufferMaxEntries:   0,
    reconnectTries:     5000,
    useNewUrlParser: true
}

module.exports = { Connection }