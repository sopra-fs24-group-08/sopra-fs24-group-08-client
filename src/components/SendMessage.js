import React, { useState } from "react";
import { useWebSocket } from "src/context/WebSocketContext";

function SendMessage() {
  const [message, setMessage] = useState("");
  const { sendMessage } = useWebSocket();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default SendMessage;
