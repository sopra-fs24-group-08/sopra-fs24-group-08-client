import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    users: [],
    friends: [],
    usersLastFetched: null,
    friendsLastFetched: null
  });

  return (
    <DataContext.Provider value={{ useData, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
