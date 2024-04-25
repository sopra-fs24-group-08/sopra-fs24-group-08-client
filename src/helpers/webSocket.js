import { useState } from 'react';
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getDomain } from "./getDomain";

export const useWebSocket = () => {
  const [stompClient, setStompClient] = useState(null);
  let retryCount = 0;

  const isConnected = () => {
    return !!stompClient && stompClient.connected;
  };

  const connect = (id, token, onConnected) => {
    if (isConnected()) {
      console.log("Already connected.");
      return;
    }

    const attemptConnection = () => {
      const url = `${getDomain()}/ws?userId=${id}&token=${token}`;
      const socketFactory = () => new SockJS(url);
      const client = Stomp.over(socketFactory);
      client.reconnect_delay = 5000;

      client.connect({}, frame => {
        console.log("Connected: " + frame);
        setStompClient(client);
        retryCount = 0;
        onConnected && onConnected();
      }, error => {
        console.error("Connection error: ", error);
        if (error.message.includes("Invalid token or userId")) {
          localStorage.clear(); // Clear potentially stale credentials
          window.location.reload(); // Reload or redirect to login
        } else {
          retryCount++;
          setTimeout(attemptConnection, Math.pow(2, retryCount) * 1000); // Exponential backoff
        }
      });
    };

    attemptConnection();
  };

  const disconnect = () => {
    if (isConnected()) {
      stompClient.disconnect(() => {
        console.log("Disconnected");
        setStompClient(null);
      });
    }
  };

  const send = (destination, headers, body) => {
    if (isConnected()) {
      stompClient.send(destination, headers, body);
    }
  };

  const subscribe = (destination, callback) => {
    return isConnected() ? stompClient.subscribe(destination, callback) : null;
  };

  const unsubscribe = (subscription) => {
    if (subscription) {
      subscription.unsubscribe();
    }
  };

  return { connect, disconnect, isConnected, send, subscribe, unsubscribe };
};
