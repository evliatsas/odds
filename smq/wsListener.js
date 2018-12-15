"use strict";

const io = require("socket.io-client");
const config = require("./config");
const { Producer, Message } = require("redis-smq");

const producer = new Producer("msg_queue", config);

const socket = io.connect(
  "http://localhost:3000/",
  { reconnect: true }
);
socket.on("newItem", function(msg) {
  const message = new Message();
  message.setBody(msg);
  producer.produceMessage(message, err => {
    if(err) console.log("error .... " + err);
  });
  var startDate = new Date(msg["timestamp"]);
  var endDate = new Date();
  var duration = (endDate - startDate) / 1000;
  console.log("enqueued msg #" + msg["id"] + " after " + duration + "ms");
});

function closeListener(){
  socket.disconnect();
  producer.shutdown();
}

process.on('SIGTERM', () => {
  closeListener();
})

process.on('SIGINT', () => {
  closeListener();
})
