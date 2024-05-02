import React from "react";
import AppRouter from "./components/routing/routers/AppRouter";
import {UserProvider} from "./components/context/UserContext";
import  WebSocketProvider from "./components/context/WebSocketProvider";
/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 * Updated by Marco Leder
 */
const App = () => {
  return (
    <WebSocketProvider>
    <UserProvider>
      <AppRouter />
    </UserProvider>
    </WebSocketProvider>
  );
};

export default App;
