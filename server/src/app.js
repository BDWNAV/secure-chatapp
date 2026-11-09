const express = require("express");
const app = express();
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

app.get("/", (req, res) => {
  res.send("Hello");
});

io.on("connection", (socket) => {
  console.log("A new connection");

  socket.on("chat_message", (msg) => {
    console.log("Message is " + msg)

    io.emit("chat_message", msg);
  })
});

server.listen(3001, () => {
  console.log("Server is active.");
});