"use strict";

const io = require("socket.io-client");
const config = require("./config");
const { Producer, Message } = require("redis-smq");

const producer = new Producer("msg_queue", config);

const socket = io.connect(
  "http://localhost:3000/",
  { reconnect: true }
);
socket.on("connect", function() {
  console.log("connected....");
});
socket.on("disconnect", function() {
  console.log("disconnected....");
  producer.shutdown();
});
socket.on("newItem", function(msg) {
  const message = new Message();
  message.setBody(msg);
  producer.produceMessage(message, err => {
    console.log("error .... " + err);
  });
  console.log("enqueued msg #" + msg[0]);
});
