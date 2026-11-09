import { io } from "socket.io-client";

const URL = "http://localhost:3001";

export const socket = io(URL);

export function sendMessage(content) {
  socket.emit("chat_message", content);
}