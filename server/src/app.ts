import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import authRouter from "./routes/auth";

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

app.use(express.json({ limit: "2kb" }));
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/", (req, res) => {
  res.send("Hello");
});

// Route configuration
app.use("/auth", authRouter);

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