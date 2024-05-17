import React, { createContext, useContext, useState, useCallback } from 'react';
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

  const refreshData = useCallback(async () => {
    try {
      console.log("refreshingData " + currUser.id);
      const headers = { Authorization: `Bearer ${currUser.token}` };
      const usersResponse = await api.get("/users", { headers });
      const friendsResponse = await api.get(`/users/${currUser.id}/friends`, { headers });
      const friendRequestsResponse = await api.get(`/users/${currUser.id}/requests`, { headers });
      const now = new Date().toISOString();
      setData({
        users: usersResponse.data,
        friends: friendsResponse.data,
        friendRequests: friendRequestsResponse.data,
        usersLastFetched: now,
        friendsLastFetched: now,
        friendRequestsLastFetched: now
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
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
