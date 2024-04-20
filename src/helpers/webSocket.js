import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getDomain } from "./getDomain";

let stompClient = null;
let connected = false;

export const connect = (onConnectCallback, updateGameUI) => {
  const url = `${getDomain()}/ws`;
  stompClient = Stomp.over(() => new SockJS(url));
  stompClient.reconnect_delay = 4000;

  stompClient.connect({}, (frame) => {
    console.log("Connected: " + frame);
    connected = true;
    if (onConnectCallback) {
      onConnectCallback();
    }

    // Subscribe to game state updates if necessary
    if (updateGameUI) {
      subscribe('/topic/gameState', updateGameUI);
    }
  }, (error) => {
    console.error("Connection error: ", error);
  });
};

export const subscribe = (destination, callback) => {
  if (!connected || !stompClient) {
    console.error("Not connected to WebSocket");
    return null;
  }
  return stompClient.subscribe(destination, message => {
    callback(JSON.parse(message.body));
  });
};

export const sendGameMessage = (gameId, message) => {
  if (!connected) {
    console.error("Not connected to WebSocket");
    return;
  }
  stompClient.send(`/app/game/${gameId}/chat`, {}, JSON.stringify(message));
};

export const sendPrivateMessage = (recipientId, message) => {
  if (!connected) {
    console.error("Not connected to WebSocket");
    return;
  }
  stompClient.send(`/app/chat/private/${recipientId}`, {}, JSON.stringify(message));
};

export const translateMessage = (userId, messageToTranslate) => {
  if (!connected) {
    console.error("Not connected to WebSocket");
    return Promise.reject("Not connected to WebSocket");
  }
  return new Promise((resolve, reject) => {
    const subscription = stompClient.subscribe(`/user/${userId}/queue/translate`, (response) => {
      resolve(JSON.parse(response.body).content);
      subscription.unsubscribe();
    }, reject);
    stompClient.send(`/app/chat/translate`, {}, JSON.stringify({
      content: messageToTranslate.content,
      targetLang: messageToTranslate.targetLang
    }));
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
      connected = false;
      stompClient = null;
    });
  }
};

export const subscribeToQueue = (userId, callback) => {
  if (!connected || !stompClient) {
    console.error("Not connected to WebSocket");
    return null;
  }
  return stompClient.subscribe(`/queue/user/${userId}`, message => {
    callback(JSON.parse(message.body));
  });
};
