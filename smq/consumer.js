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
    //calculate unique message key from event data
    const msgKey = `${message.d.event.h}/
      ${message.d.event.g}/
      ${message.d.event.competition}/
      ${new Date().getFullYear()}`;

    //fetch the existing data for the event
    const rawData = await redisClient.getAsync(msgKey);
    if (rawData) {
      //update the values of the event from the values of the message
      var data = JSON.parse(rawData);
      data.d.event.time = message.d.event.time;
      data.d.event.tp = message.d.event.tp;
      data.d.event.type = message.d.event.type;
      for (var index in message.d.live) {
        data.d.live[index] = message.d.live[index];
      }
      for (var index in message.d.markets) {
        data.d.markets[index] = message.d.markets[index];
      }
      //replace the existing event data
      await redisClient.setAsync(msgKey, JSON.stringify(data));
      //emit the updated event
      io.emit("odd", data);
    } else {
      //no existing data for the given event
      //insert the event data from the message
      await redisClient.setAsync(msgKey, JSON.stringify(message));
      //emit the new event
      io.emit("odd", message);
    }

    cb();
  }
}

MessageConsumer.queueName = "msg_queue";

const consumer = new MessageConsumer(config.smq);
consumer.run();
console.log("consumer running...");
