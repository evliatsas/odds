const io = require("socket.io")(3000);

io.on("connection", function(socket) {
  console.log("client connected...");
  sendData(socket);
  socket.on("disconnect", function() {});
});

function createObject(seed) {
  var item = {};
  for (var i = 0; i < 170; i++) {
    item["prop" + i + 1] = seed + i;
  }
  return item;
}

function sendData(socket) {
  console.time("exec");
  for (var i = 0; i < 800; i++) {
    var item = createObject(i + 1);
    socket.emit("newItem", item);
    console.log("item send." + (i + 1));
  }

  console.timeEnd("exec");
}
