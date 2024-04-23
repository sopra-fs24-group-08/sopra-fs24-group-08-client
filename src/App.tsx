import React from "react";
import Header from "./components/views/Header";
import AppRouter from "./components/routing/routers/AppRouter";
import { AuthProvider } from "./components/context/AuthContext";
import { MatchmakingProvider } from "./components/context/MatchmakingContext";
import { GameProvider } from "./components/context/GameContext";
//import TurnDecisionModal from "./components/ui//TurnDecisionModal";
import { ChatProvider } from "./components/context/ChatContext";
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";




const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                    <GameProvider>
                            <ChatProvider>
                                <AppRouter />
                            </ChatProvider>
                        </GameProvider>
                </AuthProvider>
        </BrowserRouter>

    );
};

export default App;
