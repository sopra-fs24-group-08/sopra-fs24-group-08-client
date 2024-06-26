import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import Header from "./Header";
import { Button } from "../ui/Button";
import { useData } from "../context/DataContext";
import { useCurrUser } from "../context/UserContext";
import "styles/views/Main.scss";

function Main() {
  const { logout, currUser } = useCurrUser();
  const navigate = useNavigate();
  const { data, refreshData } = useData();
  const { usersLastFetched, friendsLastFetched, friendRequestsLastFetched } = data;

  // Helper function to determine if data needs refreshing
  const needsRefresh = (lastFetched) => {
    const now = new Date().getTime();
    
    return !lastFetched || (now - new Date(lastFetched).getTime()) > 3600000; // Refresh every 1 hour
  };

  useEffect(() => {
    const fetchDataIfNeeded = async () => {
      if (needsRefresh(usersLastFetched) || needsRefresh(friendsLastFetched) || needsRefresh(friendRequestsLastFetched)) {
        await refreshData();  // Call without type to refresh all data
      }
    };

    if (currUser?.token) {
      fetchDataIfNeeded();
    }
  }, [refreshData, currUser?.token]);

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  const buttons = [
    { label: "Start", onClick: () => navigate(`/matchmaking/queue/${currUser.id}`) },
    { label: "Friends", onClick: () => navigate(`/friendlist/${currUser.id}`) },
    { label: "User List", onClick: () => navigate(`/userlist/${currUser.id}`) },
    { label: "My Profile", onClick: () => navigate(`/profiles/${currUser.id}`) },
    { label: "Tutorial", onClick: () => navigate("/tutorial") },
    { label: "Logout", onClick: () => doLogout() },
  ];

  return (
    <BaseContainer>
      <Header height="50" />
      <div className="main container">
        <div className="main button-container">
          {buttons.map((button, index) => (
            <Button key={index} onClick={button.onClick} className="full-width">{button.label}</Button>
          ))}
        </div>
      </div>
    </BaseContainer>
  );
}

export default Main;
