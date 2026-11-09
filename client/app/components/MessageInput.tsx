"use client";
import { useState } from "react";
import { sendMessage } from "@/utils/socket";

export default function MessageInput() {
  const [message, setMessage] = useState("");

  return (
    <form onSubmit={((e) => { e.preventDefault();  setMessage(""); sendMessage(message) })}>
      <input type="text" placeholder="Message to other client" value={message} onChange={((m) => { setMessage(m.target.value); })}></input>
      <button type="submit">Send</button>
    </form>
  )
}