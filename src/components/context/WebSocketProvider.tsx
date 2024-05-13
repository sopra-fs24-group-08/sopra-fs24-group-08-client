import React, { useRef, createContext, useContext, useState, useEffect } from "react";
import { isProduction } from "../../helpers/isProduction.js";
import PropTypes from "prop-types";
import { StompSubscription, Client } from "@stomp/stompjs";

export const WebSocketContext = createContext<any>(null);

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const StompClient = useRef<Client | null>(null);
  const subscriptions = useRef<Map<string, StompSubscriptionRequest>>(new Map());
  const sessionId = useRef("");
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  interface StompSubscriptionRequest {
    destination: string,
    sessionId: string,
    callback: Function,
    subscription?: StompSubscription
  }

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const connect = (token: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!token) {
        console.error("No token provided for WebSocket connection.");
        reject("No token provided");

        return;
      }
      if (retryCount >= maxRetries) {
        console.error("Maximum retry attempts reached, will not attempt to connect again.");
        reject("Max retries reached");

        return;
      }
      sessionId.current = token;
      if (!StompClient.current || !StompClient.current.active) {
        console.log("Connect called with the following token: " + sessionId.current);
        StompClient.current = new Client({
          brokerURL: isProduction()
            ? `wss://sopra-fs24-group-08-server.oa.r.appspot.com/ws?token=${encodeURIComponent(token)}`
            : `ws://localhost:8080/ws?token=${encodeURIComponent(token)}`,
          heartbeatIncoming: 15000,
          heartbeatOutgoing: 15000,
          reconnectDelay: 4000,
          debug: isProduction() ? () => {} : (str) => console.log(str),
          beforeConnect: isProduction() ? () => {} : () => console.log("Connecting to Broker"),
          onStompError: (frame) => {
            if (frame.headers.message === "Unauthorized") {
              console.error("Unauthorized access - stopping reconnection attempts");
              setRetryCount(maxRetries); // Prevent further attempts
            } else {
              if (!StompClient.current.connected) {
                setRetryCount((prev) => prev + 1);
              }
            }
          },
          onConnect: () => {
            setRetryCount(0); // Reset retry counter on successful connection
            subscriptions.current.forEach((request) => {
              if (sessionId.current === request.sessionId) {
                request.subscription = StompClient.current.subscribe(request.destination, request.callback);
              }
            });
            resolve();
          },
          onDisconnect: () => {
            if (retryCount < maxRetries) {
              setRetryCount((prev) => prev + 1); // Increment retry counter on disconnect if under max retries
            }
          }
        });
        StompClient.current.activate();
      }
    });
  };

  const disconnect = () => {
    if (StompClient.current && StompClient.current.active) {
      unsubscribeAll(); // Unsubscribe from all subscriptions
      StompClient.current.deactivate();
      console.log("WebSocket disconnected.");
      setRetryCount(0); // Reset retry counter
    }
  };

  const send = (destination: string, body: any) => {
    if (StompClient.current && StompClient.current.active) {
      console.log("Sending to the following Route" , destination, "Body:", body);
      StompClient.current.publish({
        destination: destination,
        body: body,
      });
    } else {
      console.error("Only Connected Users can send Messages to that destination");
    }
  };

  const subscribeUser = (userDestination: string, userCallback: Function) => {
    if(StompClient.current && StompClient.current.active) {
      const subscriptionRef = StompClient.current.subscribe(userDestination, userCallback);
      const subscriptionRequest: StompSubscriptionRequest = {
        destination: userDestination,
        callback: userCallback,
        sessionId: sessionId.current,
        subscription: subscriptionRef
      };
      subscriptions.current.set(userDestination, subscriptionRequest);
    }
  };

  const unsubscribeAll = () => {
    if (StompClient.current && StompClient.current.active) {
      subscriptions.current.forEach((_, request) => {
        if (request.subscription) {
          request.subscription.unsubscribe();
        }
      });
      subscriptions.current.clear();
    }
  };

  const unsubscribeUser = (destination: string) => {
    if (StompClient.current && StompClient.current.active) {
      const request = subscriptions.current.get(destination);
      if (request && request.subscription) {
        request.subscription.unsubscribe();
        subscriptions.current.delete(destination);
      }
    }
  };

  return (
    <WebSocketContext.Provider value={{ connect, disconnect, send, subscribeUser, unsubscribeUser, unsubscribeAll }}>
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default WebSocketProvider;
