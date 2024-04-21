import React from "react";
import Header from "./components/views/Header";
import AppRouter from "./components/routing/routers/AppRouter";
import { AuthProvider } from "./components/context/AuthContext";
import PersistentLayout from "./components/routing/PersistentLayout";
import {PollingProvider} from "./components/context/PollingContext";
import {ToastProvider} from "./components/context/ToastContext";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 * Updated by Marco Leder
 */


const App = () => {
    return (
        <ToastProvider>
            <PollingProvider>
                <AuthProvider>
                    <PersistentLayout>
                        <Header height="100" />
                        <AppRouter />
                    </PersistentLayout>
                </AuthProvider>
            </PollingProvider>
        </ToastProvider>
    );
};


export default App;
