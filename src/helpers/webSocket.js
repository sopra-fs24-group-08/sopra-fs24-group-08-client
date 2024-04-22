import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getDomain } from "./getDomain";

let stompClient = null;
//sockjs does not support custom headers in the initial HTTP handshake
export const connect = (callback) => {
  console.log("Trying to connect, d")
  const userToken = localStorage.getItem('token');
  if (!userToken) {
    console.error("No user token available");
    callback(false);
    return; // Exit if no token is available
  }
  console.log("we is connecting")
  const userId = localStorage.getItem('id');
  const url = `${getDomain()}/ws?userId=${userId}&token=${userToken}`;
  const socket = new SockJS(url);
  //const url = `${getDomain()}/ws`; use this if the query handshakes keep not working
  stompClient = Stomp.over(() => new SockJS(url));
  stompClient.reconnect_delay = 4000;

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
    // Add userId to the destination URL if required
    const userId = localStorage.getItem('id');  // Assuming the user ID is stored in localStorage
    stompClient.send(`/app/${destination}`, {}, JSON.stringify(payload));
  }
};

function subscribeToGameUpdates(gameId) {
  stompClient.subscribe('/topic/game/' + gameId, function(update) {
    const gameState = JSON.parse(update.body);
    updateGameUI(gameState);  // Updates the UI with new game state
  });
};

function subscribeToMatchmakingUpdates() {
  const userId = localStorage.getItem('id');
  subscribe(`/user/${userId}/queue/matchmaking`, response => {
    if (response.status === 'matched') {
      console.log('Match found:', response.gameId);
      // Navigate to game page or load game view
    } else {
      console.log('Still waiting for a match');
    }
  });
}


export const disconnect = () => {
  if (stompClient) {
    stompClient.disconnect();
    console.log("Disconnected");
    stompClient = null;
  }
};
