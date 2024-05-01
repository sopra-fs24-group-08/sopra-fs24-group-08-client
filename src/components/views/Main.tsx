import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import Header from "./Header";
import { Button } from "../ui/Button";
import { useData } from '../context/DataContext';
import { useCurrUser } from "../context/UserContext";
import "styles/views/Main.scss";


function Main() {
  const { logout, currUser } = useCurrUser();
  const navigate = useNavigate();
  const { data, refreshData } = useData();
  const { usersLastFetched, friendsLastFetched } = data;

  // Helper function to determine if data needs refreshing
  const needsRefresh = (lastFetched) => {
    const now = new Date().getTime();
    return !lastFetched || (now - new Date(lastFetched).getTime()) > 3600000; // 1 hour, set it to whatever later
    // or to event for example new friend toast.
  };

  useEffect(() => {
    const fetchDataIfNeeded = async () => {
      if (needsRefresh(usersLastFetched) || needsRefresh(friendsLastFetched)) {
        await refreshData();
      }
    };

    if (currUser?.token) {
      fetchDataIfNeeded();
    }
  }, [refreshData, usersLastFetched, friendsLastFetched, currUser?.token]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const proceedToMatchmaking = () => {
    navigate(`/matchmaking/queue/${currUser.id}`);
  };

  const proceedToMyProfile = () => {
    navigate(`/profiles/${currUser.id}`);
  };

  const navigateToFriendList = () => {
    navigate(`/friendlist/${currUser.id}`);
  };

  const navigateToUserList = () => {

    navigate(`/userlist/${currUser.id}`);
  };

  return (
    <BaseContainer className="main container">
      <Header height="100" />
      <div className="navigation form">
        <div className="login button-container">

          <Button onClick={proceedToMatchmaking}>Start</Button>
          <Button onClick={navigateToFriendList}>Friends</Button>
          <Button onClick={navigateToUserList}>UserList</Button>
          <Button onClick={proceedToMyProfile}>My Profile</Button>
          <Button onClick={handleLogout}>Logout</Button>
          <Button onClick={()=> navigate("/tutorial")}>Tutorial</Button>


        </div>
      </div>
    </BaseContainer>
  );
}

export default Main;
