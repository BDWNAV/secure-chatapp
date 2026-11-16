import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import authRouter from "./routes/auth";
import { AUTH_COOKIE_NAME, CLIENT_ORIGIN, JWT_SECRET } from "./lib/config";
import { prisma } from "./lib/prisma";

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    credentials: true
  }
});



app.use(express.json({ limit: "2kb" }));
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

app.get("/", (req, res) => {
  res.send("Hello");
});

// Route configuration
app.use("/auth", authRouter);

// Middleware
io.use(async (socket, next) => {
  if(socket.handshake.headers.origin !== CLIENT_ORIGIN) {
    return next(new Error("Unauthorized"));
  }

  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if(!cookieHeader) {
      return next(new Error("Unauthorized"));
    }

    const cookies = cookie.parseCookie(cookieHeader);

    const token = cookies[AUTH_COOKIE_NAME];

    if(!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });

    if(typeof decoded !== "object" || typeof decoded.sub !== "string") {
      return next(new Error("Unauthorized"));
    }
    
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.sub
      },
      select: {
        id: true,
        username: true,
        name: true
      }
    });

    if(user === null) {
      return next(new Error("Unauthorized"));
    }

    socket.data.user = { id: user.id, username: user.username, name: user.name };
    
    next();
  } catch (error) {
    console.error(error);

    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("A new connection");

  socket.on("chat_message", (msg) => {
    if(typeof msg !== "string") {
      return;
    }

    const messageTrimmed = msg.trim();

    if(messageTrimmed === "") {
      return;
    }

    if(messageTrimmed.length > 1000) {
      return;
    }

    const timestamp = new Date().toISOString;

    const message = {
      content: messageTrimmed,
      sender: socket.data.user,
      sentAt: timestamp
    }

    io.emit("chat_message", message);
  });
});

server.listen(3001, () => {
  console.log("Server is active.");
});