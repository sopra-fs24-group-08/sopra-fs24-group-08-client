import { useState } from 'react';
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getDomain } from "./getDomain";

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
    const socketFactory = () => new SockJS(url);

    const client = Stomp.over(socketFactory); // Pass the factory function here
    client.reconnect_delay = 5000;

    client.connect({}, frame => {
      console.log("Connected: " + frame);
      setStompClient(client);
    }, error => {
      console.error("Connection error: ", error);
      // Handle the connection error appropriately (e.g., notify the user)
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

  const sendFriendRequest = (receiverId) => {
    if (isConnected()) {
      stompClient.send("/app/friend/request", {}, JSON.stringify({ receiverId }));
    }
  };

  const subscribeToFriendRequests = (callback) => {
    if (isConnected()) {
      return stompClient.subscribe("/user/queue/friend-requests", (message) => {
        callback(JSON.parse(message.body));
      });
    }
    return null;
  };



  return { connect, disconnect, isConnected, send, subscribe, unsubscribe,sendFriendRequest, subscribeToFriendRequests };
};
