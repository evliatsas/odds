const io = require("socket.io")(3000);
var i=0;
var intervalId = null;

io.on("connection", function(socket) {
  console.log("client connected...");
  run(socket);
  socket.on("disconnect", function() {
    if(intervalId) clearInterval(intervalId);
    intervalId = null;
    console.timeEnd("exec");
  });
});

function createObject(seed) {
  var item = {};
  item["id"] = seed;
  item["timestamp"] = new Date();
  for (var i = 0; i < 170; i++) {
    item["prop" + i + 1] = seed + i;
  }
  return item;
}

function sendData(socket) {
  var item = createObject(i + 1);
    socket.emit("newItem", item);
    console.log("item send." + (i + 1));  
    i++;  
}

function run(socket){
  console.time("exec");  
  intervalId = setInterval(()=> {
    sendData(socket);
  }, 1);
}
