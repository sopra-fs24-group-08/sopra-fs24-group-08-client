import { useState } from 'react';
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {getDomain} from "./getDomain";

export const useWebSocket = () => {
  const [stompClient, setStompClient] = useState(null);

  const isConnected = () => {
    return !!stompClient && stompClient.connected;
  };

  const connect = (id, token) => {
    if (isConnected()) {
      console.log("Already connected.");
      return;
    }
    const url = `${getDomain()}/ws?userId=${id}&token=${token}`;

    // Use a factory function to allow Stomp client to reconnect using a new SockJS instance
    const socketFactory = () => {
      return new SockJS(url);
    };

    const client = Stomp.over(socketFactory); // Pass the factory function here

    // Configure automatic reconnect with a delay of 5 seconds
    client.reconnect_delay = 5000;

    client.connect({}, frame => {
      console.log("Connected: " + frame);
      setStompClient(client);
    }, error => {
      console.error("Connection error: " + error);
      // Reconnection will be attempted because of the reconnect_delay
    });
  };

  const disconnect = () => {
    if (isConnected()) {
      stompClient.disconnect(() => {
        console.log("Disconnected");
        setStompClient(null);
      });
    }
  };

  return { connect, disconnect, isConnected };
};