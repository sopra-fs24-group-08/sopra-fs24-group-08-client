import { useState } from 'react';
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getDomain } from "./getDomain";

export const useWebSocket = () => {
  const [stompClient, setStompClient] = useState(null);

  const isConnected = () => {
    return !!stompClient && stompClient.connected;
  };

  const connect = (id, token, onConnected) => {
    if (isConnected()) {
      console.log("Already connected.");
      return;
    }
    const url = `${getDomain()}/ws?userId=${id}&token=${token}`;
    const socketFactory = () => new SockJS(url);
    const client = Stomp.over(socketFactory);
    client.reconnect_delay = 5000;

    client.connect({}, frame => {
      console.log("Connected: " + frame);
      setStompClient(client);
      if (onConnected) onConnected();
    }, error => {
      console.error("Connection error: ", error);
      // Implement retry logic or a scheduled reconnection attempt
      setTimeout(() => connect(id, token, onConnected), client.reconnect_delay);
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

  const send = (destination, headers, body) => {
    if (isConnected()) {
      stompClient.send(destination, headers, body);
    } else {
      console.log("Send attempted when WebSocket is disconnected.");
    }
  };

  const subscribe = (destination, callback) => {
    if (isConnected()) {
      return stompClient.subscribe(destination, callback);
    } else {
      console.log("Subscribe attempted when WebSocket is disconnected.");
      return null;
    }
  };

  const unsubscribe = (subscription) => {
    if (subscription) {
      subscription.unsubscribe();
    }
  };

  return { connect, disconnect, isConnected, send, subscribe, unsubscribe };
};
