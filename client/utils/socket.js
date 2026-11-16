import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const socket = io(URL, { withCredentials: true, autoConnect: false });

export function sendMessage(content) {
  socket.emit("chat_message", content);
}