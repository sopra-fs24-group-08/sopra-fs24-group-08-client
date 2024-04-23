import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getDomain } from "./getDomain";

let stompClient = null;
let connected;
connected = false;

export let connect = (callback) => {
  let url = getDomain() + `/ws`;
  stompClient = Stomp.over(function () {
    return new SockJS(url);
  });
  stompClient.reconnect_delay = 4000;

  stompClient.connect({}, function (frame) {
    console.log("Connected: ", frame); // Protokollieren des frame-Parameters
    connected = true;
    callback();
    const subscription = stompClient.subscribe(
      `/topic/greetings`,
      function (frame) {
        console.log("Subscribed: " + frame);
      },

      function (frame) {
        console.log("Error: " + frame);
      }
    );
    console.log(subscription);
  });
};

export let subscribe = (goal, callback) => {
  stompClient.subscribe(goal, function (data) {
    callback(JSON.parse(data.body));
  });
};

//Depending on the type of WS connection pass sth else, will have to handle Backend: e.g. userId + other data
//(leave Game)
export let unsubscribe = (credentials) => {
  stompClient.unsubscribe(credentials);
};

//Logout e.g.
export let disconnect = () => {
  if (stompClient !== null) {
    stompClient.disconnect(function () {
      console.log("User disconnected from the WebSocket");
    });
    stompClient = null;
    connected = false;
  }
};

export let isConnected = () => connected;

//doesn't work yet, just leaving here for sb else or I do later.
export let Translation = (chatId) => {
  stompClient.send("/app/chat/" + chatId);
};

