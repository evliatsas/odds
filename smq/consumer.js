"use strict";

const config = require("./config");
const redisSMQ = require("redis-smq");
const redisClient = require("./redis-client");
const io = require("socket.io")(config.restapi.port);
const redisAdapter = require("socket.io-redis");

io.adapter(
  redisAdapter({
    host: config.smq.redis.host,
    port: config.smq.redis.port
  })
);

const Consumer = redisSMQ.Consumer;

class MessageConsumer extends Consumer {
  async consume(message, cb) {
    const msgKey = `${message.d.event.h}/
      ${message.d.event.g}/
      ${message.d.event.competition}/
      ${new Date().getFullYear()}`;
    const rawData = await redisClient.getAsync(msgKey);
    if (rawData) {
      var data = JSON.parse(rawData);
      for (var index in message.d.live) {
        data.d.live[index] = message.d.live[index];
      }
      for (var index in message.d.markets) {
        data.d.markets[index] = message.d.markets[index];
      }

      await redisClient.setAsync(msgKey, JSON.stringify(data));
    } else {
      await redisClient.setAsync(msgKey, JSON.stringify(message));
    }

    io.emit("odd", message);
    cb();
  }
}

MessageConsumer.queueName = "msg_queue";

const consumer = new MessageConsumer(config.smq);
consumer.run();
console.log("consumer running...");
