"use client";
import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import ChatWindow from "./components/ChatWindow";

export default function Home() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect)

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    }
  }, []);

  return (
    <div>
      <ChatWindow></ChatWindow>
    </div> 
  );
}
