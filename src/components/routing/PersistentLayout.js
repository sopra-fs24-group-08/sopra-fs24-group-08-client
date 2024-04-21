import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { connect } from "../../helpers/webSocket";

const PersistentLayout = ({ children }) => {
    const { auth, setAuth } = useAuth();

    useEffect(() => {
        if (auth.token && !auth.isConnected) {
            connect((isConnected) => {
                console.log("WebSocket connection established: " + isConnected);
                // Update auth state to reflect connection status
                setAuth(prev => ({ ...prev, isConnected }));
            });
        }
    }, [auth.token, setAuth]);

    return <div>{children}</div>;
};

export default PersistentLayout;
