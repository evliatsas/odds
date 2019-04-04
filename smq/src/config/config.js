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
    port: 5003
  },
  mongodb: {
    host: '127.0.0.1',
    port: '27017',
    database: 'Odds'
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

module.exports.socket = {
  port: 5000,
  ipAddress: '127.0.0.1'
}

module.exports.restapi = {
  port: 5001,
  logPath: '../../logs'
}

module.exports.token = {
  secret: 'nZr4t7w!z%C*F-JaNdRgUkXp2s5v8x/A?D(G+KbPeShVmYq3t6w9z$B&E)H@McQf'
}
