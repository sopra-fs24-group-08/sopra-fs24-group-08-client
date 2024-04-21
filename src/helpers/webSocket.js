import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getDomain } from "./getDomain";

let stompClient = null;

export const connect = (callback) => {
  // Retrieve the user token from localStorage
  const userToken = localStorage.getItem('token');
  if (!userToken) {
    console.error("No user token available");
    callback(false);
    return; // Exit if no token is available
  }

  const url = `${getDomain()}/ws?token=${userToken}`;
  stompClient = Stomp.over(() => new SockJS(url));
  stompClient.reconnect_delay = 6666;

  stompClient.connect({}, frame => {
    console.log("Connected: " + frame);
    if (callback) {
      callback(true);  // Pass true to indicate a successful connection
    }
  }, error => {
    console.error("Could not connect to WebSocket: " + error);
    if (callback) {
      callback(false);  // Pass false to indicate a failed connection
    }
  });
};

export const subscribe = (destination, callback) => {
  if (stompClient) {
    return stompClient.subscribe(destination, message => {
      callback(JSON.parse(message.body));
    });
  }
};

export const send = (destination, payload) => {
  if (stompClient && stompClient.connected) {
    stompClient.send(destination, {}, JSON.stringify(payload));
  }
};

export const disconnect = () => {
  if (stompClient) {
    stompClient.disconnect();
    console.log("Disconnected");
    stompClient = null;
  }
};
