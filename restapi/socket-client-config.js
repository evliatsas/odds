module.exports = function(type) {
  let fuzzers = {
    headless: false,
    socketIP: '95.216.70.139',
    port: 3000,
    type: 'fuzzers',
    name: 'Customer API',
    provider: 'bet365',
    interval: 2000,
    username: 'admin',
    password: 'admin123'
  }
  return fuzzers
}
