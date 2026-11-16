"use client";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import type { Message } from "../../types/message";
import { useRouter } from "next/navigation";

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  useEffect(() => {
    console.log("ChatWindow mounted")
    const handleMessage = (msg: Message) => {
      console.log(msg);

      setMessages((prev) => [...prev, msg]);
    }

    const handleConnectError = () => {
      router.replace("/login");
    }

    socket.on("connect_error", handleConnectError);

    socket.on("chat_message", handleMessage);

    socket.connect();

    return () => {
      socket.off("chat_message", handleMessage);

      socket.disconnect();
    }

    
  }, []);
 
  return (
    <div>
      <MessageInput></MessageInput>
    </div>
  )
}   