'use strict'

const config = require('./config')
const monitorServer = require('redis-smq').monitor(config.smq)

monitorServer.listen(() => {
  console.log(`Monitor server is running on port ${config.smq.monitor.port}`)
})
