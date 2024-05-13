import React, { createContext, useContext, useState } from "react";
import { api } from "../../helpers/api";
import { useCurrUser} from "./UserContext";
import PropTypes from "prop-types";


export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { currUser } = useCurrUser();
  const [data, setData] = useState({
    users: [],
    friends: [],
    usersLastFetched: null,
    friendsLastFetched: null
  });

  const refreshData = async () => {
    try {
      console.log("refreshingData"+currUser)
      const usersResponse = await api.get("/users",{headers: {Authorization: `Bearer ${currUser.token}`}});
      const friendsResponse = await api.get(`/users/${currUser.id}/friends`,{headers: {Authorization: `Bearer ${currUser.token}`}});
      const now = new Date().toISOString();
      setData({
        users: usersResponse.data,
        friends: friendsResponse.data,
        usersLastFetched: now,
        friendsLastFetched: now
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

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
