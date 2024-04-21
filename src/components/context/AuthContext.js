import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ token: null, user: null });

    const login = (user, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("id", user.id);
        setAuth({ token, user });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        setAuth({ token: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
