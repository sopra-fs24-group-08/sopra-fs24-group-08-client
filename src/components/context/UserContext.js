import React, { createContext, useContext, useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import PropTypes from "prop-types";
import { useWebSocket } from "./WebSocketProvider";
import {useFriend} from "./FriendContext"

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { connect, disconnect } = useWebSocket();
  const {friendSubscribe} = useFriend();

  const [currUser, setCurrUser] = useState(() => {
    const savedUser = sessionStorage.getItem("currUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      return { id: parsedUser.id, token: parsedUser.token };
    }

    return { id: null, token: null };
  });


  const login = async (username, password) => {
    try {
      const response = await api.post("/users/login", { username, password });
      sessionStorage.setItem("currUser", JSON.stringify(response.data));
      sessionStorage.setItem("id", response.data.id);
      sessionStorage.setItem("token", response.data.token);
      setCurrUser({ id: response.data.id, token: response.data.token });

      return true;
    } catch (error) {
      console.error("Login failed:", error.message);
      alert(`Login failed: ${error.message}`);

      return false; // Indicate complete failure
    }
  };

  const register = async (username, password) => {
    try {
      const response = await api.post("/users", { username, password });
      sessionStorage.setItem("currUser", JSON.stringify(response.data));
      sessionStorage.setItem("id", response.data.id);
      sessionStorage.setItem("token", response.data.token);
      setCurrUser({ id: response.data.id, token: response.data.token });

      return true;
    } catch (error) {
      console.error("Registration failed:", error.message);
      alert(`Registration failed: ${error.message}`);

      return false;
    }
  };

  const logout = async () => {
    try {
      // Attempt to call the API to log out
      await api.put(`/users/${currUser.id}/logout`, null, {
        headers: { Authorization: `Bearer ${currUser.token}` },
      });
      console.log("Logout successful");
      sessionStorage.clear(); // Clear all session storage, including tokens
      setCurrUser({ id: null, token: null });
      disconnect();
    } catch (error) {
      handleError(error);
      console.error(`Logout failed: ${error.message}`);
    }
  };

  useEffect(() => {
    // Only attempt to connect if there's a valid token
    if (currUser && currUser.token) {
      connect(currUser.token).then(() => friendSubscribe(currUser)).catch(console.error);
      // subscribe after connection established
    } else {
      // Ensure to disconnect if no valid user is authenticated
      disconnect();
    }
  }, [currUser, connect, disconnect]);

  return (
    <UserContext.Provider value={{ currUser, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node,
};

export const useCurrUser = () => useContext(UserContext);
