const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});

io.on("connection", (socket) => {
  var ipaddress = socket.handshake.headers["x-forwarded-for"];
  console.info("%s connected!", ipaddress);

  socket.on("chat message", (msg, username) => {
    io.emit("chat message", msg, username);
  });

  socket.on("user join", (username) => {
    io.emit("user join", username);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
