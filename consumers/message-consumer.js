"use strict";

const redisSMQ = require("redis-smq");

const Consumer = redisSMQ.Consumer;

class MessageConsumer extends Consumer {
  /**
   *
   * @param message
   * @param cb
   */
  consume(message, cb) {
    /* eslint class-methods-use-this: 0 */
    console.log(`Got message to consume: `, message);
    //  throw new Error('TEST!');
    //  cb(new Error('TEST!'));
    //  const timeout = parseInt(Math.random() * 100);
    //  setTimeout(() => {
    //      cb();
    //  }, timeout);
    cb();
  }
}

MessageConsumer.queueName = "msg_queue";

module.exports = MessageConsumer;
