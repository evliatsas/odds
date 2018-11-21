"use strict";

const config = require("./config");
const MessageConsumer = require("./consumers/message-consumer");

const consumer = new MessageConsumer(config, { messageConsumeTimeout: 2000 });
consumer.run();
