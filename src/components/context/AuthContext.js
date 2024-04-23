import PropTypes from 'prop-types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWebSocket } from '../../helpers/webSocket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ currUser: null, token: null, id: null});
    const websocket = useWebSocket();

    useEffect(() => {
        if (auth.token && auth.id && !websocket.isConnected()) {
            console.log("Attempting to connect WebSocket with ID:", auth.id);
            websocket.connect(auth.id, auth.token);
        }
        return () => {
            if (!auth.token && websocket.isConnected()) {
                console.log("Disconnecting WebSocket");
                websocket.disconnect();
            }
        };
    }, [auth.token, auth.id, websocket]);  // Ensure websocket is part of the dependency array

    const login = (user) => {
        localStorage.setItem('token', user.token);
        localStorage.setItem("currUser", JSON.stringify(user));
        localStorage.setItem("id", user.id);
        setAuth({ currUser: JSON.stringify(user), token: user.token, id: user.id });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('currUser');
        localStorage.removeItem('id');
        setAuth({ currUser: null, token: null, id: null });
    };

    return (
        <AuthContext.Provider value={{ ...auth, login, logout, websocket }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node
};

export const useAuth = () => useContext(AuthContext);