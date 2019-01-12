'use strict'

const path = require('path')

module.exports.smq = {
  redis: {
    host: '127.0.0.1',
    port: 6379
  },
  log: {
    enabled: false,
    options: {
      level: 'trace',
      streams: [
        {
          path: path.normalize(`${__dirname}/logs/smq.log`)
        }
      ]
    }
  },
  monitor: {
    enabled: true,
    host: '127.0.0.1',
    port: 3001
  }
}

module.exports.odds = {
  uri: 'http://95.216.70.139:3001/fuzzers',
  fuzzers: {
    headless: false,
    socketIP: '95.216.70.139',
    port: 3001,
    type: 'fuzzers',
    name: 'Customer API',
    provider: 'bet365',
    interval: 2000,
    username: 'admin',
    password: 'admin123'
  }
}

module.exports.restapi = {
  port: 5000
}
