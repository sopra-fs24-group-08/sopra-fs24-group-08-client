import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getDomain } from "./getDomain";

let stompClient = null;
let connected = false
//using @stomp/stompjs instead of stompjs less maintained

export const connect = (onConnectCallback) => {
  const url = `${getDomain()}/ws`;
  stompClient = Stomp.over(() => new SockJS(url));
  stompClient.reconnect_delay = 4000;

  stompClient.connect({}, (frame) => {
    console.log("Connected: " + frame);
    connected = true;
    onConnectCallback();

    subscribe('/topic/gameState', (gameState) => {
      updateGameUI(gameState);
    });
  }, (error) => {
    console.error("Connection error: ", error);
  });
};

export const subscribe = (goal, callback) => {
  if (!connected || !stompClient) {
    console.error("Not connected to WebSocket");
    return;
  }
  return stompClient.subscribe(goal, message => {
    callback(JSON.parse(message.body));
  });
};

export const sendMove = (gameId, move) => {
  if (!connected) {
    console.error("Not connected to WebSocket");
    return;
  }
  stompClient.send(`/app/game/${gameId}/move`, {}, JSON.stringify(move));
};

export const disconnect = () => {
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log("Disconnected");
    });
    connected = false;
    stompClient = null;
  }

};

export const subscribeToQueue = (userId, callback) => {
  const queuePath = `/queue/user/${userId}`;
  return stompClient.subscribe(queuePath, message => {
    callback(JSON.parse(message.body));
  });
}


