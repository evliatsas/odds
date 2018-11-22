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
    var startDate = new Date(message["timestamp"]);
    var endDate = new Date();
    var duration = (endDate - startDate) / 1000;
    console.log("consumed msg #" + message["id"] + " after " + duration + "ms");
    cb();
  }
}

MessageConsumer.queueName = "msg_queue";

module.exports = MessageConsumer;
