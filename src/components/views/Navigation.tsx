import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Navigation.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {usePolling} from "components/context/PollingContext";
import { toast } from "react-toastify";
import Header from "./Header";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const Navigation = () => {
  const navigate = useNavigate();
  const { setCurrentUserId, inGame } = usePolling();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inGame === true){
      navigate("/kittycards");
    }
  }, [inGame]);


  function myProfile (){
    const myId = localStorage.getItem("id");
    let push_to = "/users/" + myId;
    navigate(push_to);
  };
  function navigateToFriendList(){
    navigate("/friendList");
  }
  function navigateToUserList(){
    navigate("/userList");
  };
  async function logout() {
    const myId = localStorage.getItem("id");
    const request_to = "/logout/" + myId
    try {
      const res = await api.put(request_to)
    } catch (error) {
      console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
      console.error("Details:", error);
      alert("Something went wrong while fetching the users! See the console for details.");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("id");
    setCurrentUserId(null);
    toast.dismiss();
    navigate("/login");
  }
  const doMatch = async () => {
    try {
      setLoading(true);
      const myId = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const response = await api.put(`/games/queue/${myId}`,{}, {headers: {Authorization: `Bearer ${token}`}});
      const matchResult = (response.data.gameId !== null);
      setLoading(false);
      if (matchResult){
        // Login successfully worked --> navigate to the route /game in the GameRouter
        navigate("/kittycards");
      }
    } catch (error) {
      alert(
        `Something went wrong during matching a opponent: \n${handleError(error)}`
      );
      setLoading(false);
      doQuitQueueing();
    }
  };

  const doQuitQueueing = async () => {
    try {
      const myId = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const response = await api.delete(`/games/dequeue/${myId}`, {headers: {Authorization: `Bearer ${token}`}});
      alert(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(
        `Something went wrong during quiting the queue: \n${handleError(error)}`
      );
    }
  };

  return (
    <div>
      {loading?(
        <div>
          <div>Loading...</div>
          <div className="navigation button-container">
            <Button
              style={{ width: "100%", marginBottom: "10px" }}
              onClick={() => doQuitQueueing()}
            >
              Quit
            </Button>
          </div>
        </div>
      ): (    
        <BaseContainer>
          <Header height="100" />
          <div className="navigation container">
            <div className="navigation form">
              <div className="navigation button-container">
                <Button
                  style={{ width: "100%", marginBottom: "10px" }}
                  onClick={() => doMatch()}
                >
              Start
                </Button>
                <Button
                  style={{ width: "100%", marginBottom: "10px" }}
                  onClick={() => navigateToFriendList()}
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
                  onClick={() => myProfile()}
                >
                  My Profile
                </Button>
                <Button
                  style={{ width: "100%", marginBottom: "10px" }}
                  onClick={() => logout()}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </BaseContainer>)}
    </div>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Navigation;
