var io = require("socket.io-client");

var socket = io.connect(
  "http://localhost:3000/",
  { reconnect: true }
);

socket.on("connect", function() {
  console.log("connected....");
});

socket.on("newItem", function(msg) {
  console.log(msg);
});
