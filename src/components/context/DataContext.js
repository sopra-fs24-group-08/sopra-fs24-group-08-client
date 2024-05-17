import React, { createContext, useContext, useState, useCallback } from "react";
import { api } from "../../helpers/api";
import { useCurrUser } from "./UserContext";
import PropTypes from "prop-types";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { currUser } = useCurrUser();
  const [data, setData] = useState({
    users: [],
    friends: [],
    friendRequests: [],
    usersLastFetched: null,
    friendsLastFetched: null,
    friendRequestsLastFetched: null
  });

  const refreshData = useCallback(async (type) => {
    const headers = { Authorization: `Bearer ${currUser.token}` };
    const now = new Date().toISOString();
    try {
      if (!type || type === "users") {
        const usersResponse = await api.get("/users", { headers });
        setData(prevData => ({
          ...prevData,
          users: usersResponse.data,
          usersLastFetched: now
        }));
      }
      if (!type || type === "friends") {
        const friendsResponse = await api.get(`/users/${currUser.id}/friends`, { headers });
        setData(prevData => ({
          ...prevData,
          friends: friendsResponse.data,
          friendsLastFetched: now
        }));
      }
      if (!type || type === 'friendRequests') {
        const friendRequestsResponse = await api.get(`/users/${currUser.id}/requests`, { headers });
        setData(prevData => ({
          ...prevData,
          friendRequests: friendRequestsResponse.data,
          friendRequestsLastFetched: now
        }));
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [currUser]);

  return (
    <DataContext.Provider value={{ data, setData, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node
};

export const useData = () => useContext(DataContext);
