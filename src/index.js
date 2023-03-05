const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});

io.on("connection", function (socket) {
  var ip1 = socket.conn.remoteAddress;
  var ip2 = socket.request.connection.remoteAddress;

  console.log(ip1);
  console.log(ip2);

  var sHeaders = socket.handshake.headers;
  console.info(
    "[%s:%s] CONNECT",
    sHeaders["x-forwarded-for"],
    sHeaders["x-forwarded-port"]
  );

  var endpoint = socket.manager.handshaken[socket.id].address;
  console.log(
    "Client connected from: " + endpoint.address + ":" + endpoint.port
  );
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
