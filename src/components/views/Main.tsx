import React, { useEffect } from "react";
import { useCurrUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import Header from "./Header";
import { Button } from "../ui/Button";
import { useData } from '../context/DataContext';
import {api,handleError} from "../../helpers/api"

function Main() {
  const { logout,currUser } = useCurrUser();
  const navigate = useNavigate();
  const { userData, setUserData } = useData();

  //Fetch whenever somebody enters Main Page-> Longer game -> some client issue and the users was logged out as a response
  const fetchDataIfNeeded = async () => {
    const now = new Date().getTime();
    const shouldFetchUsers = !userData.usersLastFetched || (now - new Date(userData.usersLastFetched).getTime()) > 3600000;
    const shouldFetchFriends = !userData.friendsLastFetched || (now - new Date(userData.friendsLastFetched).getTime()) > 3600000;

    //Could make it more efficient if we would compare the users friends with currUser.id and then imemdiately return them as well,
    // so we wouldnt have to do next call
    if (shouldFetchUsers) {
      const usersResponse = await api.get('/users',{headers: {Authorization: `Bearer ${currUser.token}`}});
      setUserData(prev => ({
        ...prev,
        users: usersResponse.data,
        usersLastFetched: new Date().toISOString()
      }));
    }
    if (shouldFetchFriends) {
      const friendsResponse = await api.get('/users/friends',{headers: {Authorization: `Bearer ${currUser.token}`}});
      setUserData(prev => ({
        ...prev,
        friends: friendsResponse.data,
        friendsLastFetched: new Date().toISOString()
      }));
    }
  };

  useEffect(() => {
    fetchDataIfNeeded();
  }, []);


  const handleLogout = () => {
    console.log(currUser,"AUTH");
    console.log(currUser.token);
    logout();
  };

  const proceedToMatchmaking = () => {
    const userId = sessionStorage.getItem("id") || currUser.id;
    navigate(`/matchmaking/queue/${userId}`)
  }

    const proceedToMyProfile = (id) =>{
    if (currUser.id === id && currUser.id != null || undefined){
      navigate(`/profiles/${currUser.id}`);}
    else{
      logout()
      alert("You have been send to the login page, something when wrong while trying to fetch your profile")

      }};

   const  navigateToFriendList = (userId) =>{
     const id = sessionStorage.getItem("id");
     if (currUser.id === id && currUser.id != null || undefined){
       navigate(`/friendlist`);}
     else{
       logout() //perhaps add less aggressive measures
       alert("You have been send to the login page, something when wrong while trying to fetch your profile")
     }
   };

   const  navigateToUserList = () =>{
     navigate("/userList")
   }

   return (
        <BaseContainer>
          <Header height="100" />
          <div className="navigation container">
            <div className="navigation form">
              <div className="navigation button-container">
                <Button
                  style={{ width: "100%", marginBottom: "10px" }}
                  onClick={() => proceedToMatchmaking()}
                >
                  Start
                </Button>
                <Button
                  style={{ width: "100%", marginBottom: "10px" }}
                  onClick={() => navigateToFriendList(currUser.id)}
                >
                  Friends
                </Button>
                <Button
                  style={{ width: "100%", marginBottom: "10px" }}
                  onClick={() => navigateToUserList()}
                >
                  UserList
                </Button>
                <Button
                  style={{ width: "100%", marginBottom: "10px" }}
                  onClick={() => proceedToMyProfile(currUser.id)}
                >
                  My Profile
                </Button>
                <Button
                  style={{ width: "100%", marginBottom: "10px" }}
                  onClick={() => logout()}
                >
                  Logout
                </Button>
                <Button onClick={handleLogout}>Logout</Button>
              </div>
            </div>
          </div>
        </BaseContainer>
  );
}

export default Main;
