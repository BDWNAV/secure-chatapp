"use client";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    console.log("ChatWindow mounted")

    const handleMessage = (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    }

    socket.on("chat_message", handleMessage);

    return () => {
      socket.off("chat_message", handleMessage);
    }
  }, []);
 
  return (
    <div>
      {messages.map((msg) => {
        return <p>{msg}</p>
      })}

      <MessageInput></MessageInput>
    </div>
  )
}   