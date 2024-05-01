import React, { createContext, useContext, useState, useEffect } from "react";
import { api, handleError} from "../../helpers/api";
import PropTypes from "prop-types";

const UserContext = createContext(null);
//Should have chosen better Name, currUser in context is token , id and currUser in sessionStorage is full object.
export const UserProvider = ({ children }) => {
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
      await api.put(`/users/${currUser.id}/logout`, null, {
        headers: { Authorization: `Bearer ${currUser.token}` }
      });
      console.log("Logout successful");
      sessionStorage.clear();
      setCurrUser({ id: null, token: null });

    } catch (error) {
      handleError(error);
      alert(`Logout failed: ${error.message}`);
    }
  };

  return (
    <UserContext.Provider value={{ currUser, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node
};

export const useCurrUser = () => useContext(UserContext);
