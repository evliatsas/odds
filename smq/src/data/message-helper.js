module.exports.generateKey = message => {
  try {
    const msgKey = `${message.d.event.h} vs ${message.d.event.g}:${
      message.d.event.competition
    }:${message.d.event.sport}:${
      message.d.event.type
    }:${new Date().getFullYear()}`

    return msgKey
      .replace('/', '-')
      .replace('@', '-')
      .replace('?', '.')
      .replace('&', '.')
  } catch (error) {
    console.log('Error generating key')
    console.log(error)
  }
}

module.exports.cleanString = key => {
  return key
    .replace('/', '-')
    .replace('@', '-')
    .replace('?', '.')
    .replace('&', '.')
}
