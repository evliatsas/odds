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
    const msgKey = `${message.d.event.h}/${message.d.event.g}/${
      message.d.event.competition
    }/${new Date().getFullYear()}`;

    const exists = await redisClient.existsAsync(msgKey);
    if (exists) {
      //fetch the existing data for the event
      const rawData = await redisClient.getAsync(msgKey);
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
      data.d.meta.gameSummary = message.d.meta.gameSummary;
      //if the event status has changed
      if (data.d.meta.gameStatus !== message.d.meta.gameStatus) {
        //remove event key from the previous status set
        await this.removeFromStatusSet(data.d.meta.gameStatus, msgKey);
        data.d.meta.gameStatus = message.d.meta.gameStatus;
        //add event key to the current status set
        await this.assignToStatusSet(data.d.meta.gameStatus, msgKey);
      }
      //replace the existing event data
      await redisClient.setAsync(msgKey, JSON.stringify(data));
      //emit the updated event
      io.emit("odd", data);
    } else {
      //no existing data for the given event
      //insert the event data from the message
      await redisClient.setAsync(msgKey, JSON.stringify(message));
      //add the new event to the list of events per sport
      await this.addToSportList(msgKey, message);
      //add the new event to the event status SET
      await this.assignToStatusSet(message.d.meta.gameStatus, msgKey);
      //emit the new event
      io.emit("odd", message);
    }

    cb();
  }

  //add event to the sport list
  async addToSportList(msgKey, message) {
    const listKey = `${message.d.event.sport}/${message.d.event.league}/${
      message.d.event.competition
    }`;
    await redisClient.lpushAsync(listKey, msgKey);
  }

  //assign event to its current status set
  async assignToStatusSet(status, msgKey) {
    const exists = await redisClient.sismemberAsync(status, msgKey);
    if (!exists) {
      await redisClient.saddAsync(status, msgKey);
    }
  }

  //remove event from its previous status set
  async removeFromStatusSet(status, msgKey) {
    const exists = await redisClient.sismemberAsync(status, msgKey);
    if (exists) {
      await redisClient.sremAsync(status, msgKey);
    }
  }
}

MessageConsumer.queueName = "msg_queue";

const consumer = new MessageConsumer(config.smq);
consumer.run();
console.log("consumer running...");
