import React from "react";
import Header from "./components/views/Header";
import AppRouter from "./components/routing/routers/AppRouter";
import { ToastProvider } from "./components/context/ToastContext";
import { AuthProvider } from "./components/context/AuthContext";
import { MatchmakingProvider } from "./components/context/MatchmakingContext";
import { GameProvider } from "./components/context/GameContext";
//import TurnDecisionModal from "./components/ui//TurnDecisionModal";
import { ChatProvider } from "./components/context/ChatContext";
import {BrowserRouter} from "react-router-dom";




const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastProvider>
                    <MatchmakingProvider>
                        <GameProvider>
                            <ChatProvider>
                                <AppRouter />
                            </ChatProvider>
                        </GameProvider>
                    </MatchmakingProvider>
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>

    );
};

export default App;
