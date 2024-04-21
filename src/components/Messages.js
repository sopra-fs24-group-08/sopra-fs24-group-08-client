import React from "react";
import { useWebSocket } from "../context/WebSocketContext";

const Messages= () => {
  const { messages } = useWebSocket();

  return (
    <div>
      <h2>Messages</h2>
      {messages.map((msg, id) => (
        <p key={id}>{msg}</p>
      ))}
    </div>
  );
}

export default Messages;
