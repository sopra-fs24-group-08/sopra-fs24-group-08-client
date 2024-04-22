import React from "react";
import Header from "./components/views/Header";
import AppRouter from "./components/routing/routers/AppRouter";
import { ToastProvider } from "./components/context/ToastContext";
import { PollingProvider } from "./components/context/PollingContext";
import { AuthProvider } from "./components/context/AuthContext";
import PersistentLayout from "./components/routing/PersistentLayout";
//import { MatchmakingProvider } from "./components/context/MatchmakingContext";
//import TurnDecisionModal from "./components/ui//TurnDecisionModal";


const App = () => {
    return (
        <AuthProvider>
            <PersistentLayout>
                <ToastProvider>
                    <PollingProvider>
                        <Header height="100" />
                        <AppRouter />
                    </PollingProvider>
                </ToastProvider>
            </PersistentLayout>
        </AuthProvider>
    );
};

export default App;
