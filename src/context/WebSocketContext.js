import React, { createContext, useContext, useState, useEffect} from "react";
import PropTypes from "prop-types";
import { getDomain } from "../helpers/getDomain";
const WebSocketContext = createContext(null);

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const protocol = window.location.protocol;
    const domain = getDomain().split("//")[1];
    const newSocket = new WebSocket(`${protocol === "https:" ? "wss:" : "ws:"}//${domain}/ws`);

    newSocket.onopen = () => {
      console.log("WS-Connection established");
    };

    newSocket.onmessage = (event) => {
      console.log("Receiving Message", event.data);
      setMessages(previousMessages => [...previousMessages, event.data]);
    };

    newSocket.onclose = () => {
      console.log("WS-Connection disabled");
      setSocket(null);
    };

    setSocket(newSocket);

    return () => newSocket.close();
  }, [setSocket]);

  const sendMsg = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.log("Not connected to WS");
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMsg, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};
WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired
};