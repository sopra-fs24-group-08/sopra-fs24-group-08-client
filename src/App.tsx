import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from "./components/routing/routers/AppRouter";
import { AuthProvider } from "./components/context/AuthContext";
import { GameProvider } from "./components/context/GameContext";
import { ChatProvider } from "./components/context/ChatContext";


const App = () => {
  return (
    <AuthProvider>
      <GameProvider>
        <ChatProvider>
          {/* AppRouter manages routing, ToastContainer provides global toast notifications ,Provider we use for Context*/}
          <AppRouter />
          <ToastContainer/>
        </ChatProvider>
      </GameProvider>
    </AuthProvider>
  );
};

export default App;
