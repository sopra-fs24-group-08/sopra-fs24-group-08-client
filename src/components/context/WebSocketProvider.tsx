import React, { useRef, createContext, ReactNode, useContext } from "react";
import { isProduction } from "../../helpers/isProduction.js";
import PropTypes from "prop-types";
import { StompSubscription, Client } from "@stomp/stompjs";

export const WebSocketContext = createContext<any>(null);

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode; // This tells TypeScript that children is a ReactNode
}

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const StompClient = useRef<Client | null>(null);
  const subscriptions = useRef<Map<string, StompSubscriptionRequest>>(new Map());
  const sessionId = useRef("");


  interface StompSubscriptionRequest {
    destination: string,
    sessionId: string,
    callback: Function
    subscription?: StompSubscription
  }
  //https://stomp-js.github.io/guide/stompjs/using-stompjs-v5.html copied that,adjust
  const connect = ( token: string ): Promise<void> => {
    return new Promise((resolve, reject) => {
      sessionId.current = token;
      if (!StompClient.current || !StompClient.current.active) {
        console.log("Connect called with the following token: " + sessionId.current)
        StompClient.current = new Client({
          brokerURL: isProduction()? "wss://sopra-fs24-group-08-server.oa.r.appspot.com/ws":"ws://localhost:8080/ws",
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,
          reconnectDelay: 5000,
          debug: isProduction() ? () => {} : (str) => console.log(str),
          beforeConnect: isProduction() ? () => {} : () => console.log("Connecting to Broker"),
          onStompError: (frame) => {
            `Error encountered at Broker: ${frame}`;
          },
          onWebSocketError: () => {
            "WebSocket Error";
          }
        })
        StompClient.current.onConnect = () => {
          subscriptions.current.forEach((request) => {
            if (sessionId.current === request.sessionId) {
              request.subscription = StompClient.current.subscribe(request.destination, request.callback)
            }
            else {
              console.log("Deleting Subscription" + request.destination)
              subscriptions.current.delete(request.destination)
            }
          })
          resolve()
        }
      }
      StompClient.current.activate()
    });
  };

  const disconnect = () => {
    if (StompClient.current && StompClient.current.active) {
      unsubscribeAll(); // Unsubscribe from all subscriptions
      StompClient.current.deactivate();
      console.log("WebSocket disconnected.");
    }
  };

  //Docs say .publish but since we always worked with send I changed it to this , so everything that used to be .send should
  // still work with websocket stuff
  function send(destination: string, body: any) {
    if (StompClient.current && StompClient.current.active) {
      console.log("Sending to the following Route" , destination, "Body:", body);
      StompClient.current.publish({
        destination: destination,
        body: body,
      });
    } else {
      console.error("Only Connected Users can send Messages to that destination");
    }
  }

  function subscribeUser(userDestination: string, userCallback: Function) {
    if(StompClient.current && StompClient.current.active) {
      const subscriptionRef = StompClient.current.subscribe(userDestination, userCallback)
      const subscriptionRequest: StompSubscriptionRequest = {
        destination: userDestination,
        callback: userCallback,
        sessionId: sessionId.current,
        subscription: subscriptionRef
      }
      subscriptions.current.set(userDestination, subscriptionRequest)
    }
  }

  function unsubscribeAll() {
    if (StompClient.current && StompClient.current.active) {
      subscriptions.current.forEach((_, request) => {
        if (request.subscription) {
          request.subscription.unsubscribe();
        }
      });
      subscriptions.current.clear();
    }
  }

  function unsubscribeUser(destination: string) {
    if (StompClient.current && StompClient.current.active) {
      const request = subscriptions.current.get(destination);
      if (request.subscription) {
        request.subscription.unsubscribe();
      }
      subscriptions.current.delete(destination);
    }
  }


  return (<WebSocketContext.Provider value={{ connect, disconnect, send, subscribeUser, unsubscribeUser, unsubscribeAll }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;