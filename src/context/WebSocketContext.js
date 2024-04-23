import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getDomain } from "../helpers/getDomain";
import { connect, disconnect, send } from "../helpers/webSocket";

const WebSocketContext = createContext(null);

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    connect((socket) => {
      setSocket(socket);
    });
    return () => {
      if (socket) {
        socket.close();
      }
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        console.log("WS-Connection established");
      };

      socket.onmessage = (event) => {
        console.log("Receiving Message", event.data);
        setMessages(previousMessages => [...previousMessages, event.data]);
      };

      socket.onclose = () => {
        console.log("WS-Connection disabled");
        setSocket(null);
      };
    }
  }, [socket]);

  const sendMessage = (message) => {

      send(message);

  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired
};
