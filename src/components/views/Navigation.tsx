import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Navigation.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {usePolling} from "components/context/PollingContext";
import { toast } from "react-toastify";
import { send, disconnect ,subscribe} from "../../helpers/webSocket";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const Navigation = () => {
  const navigate = useNavigate();
  const {serverRequests, currentUserId, setCurrentUserId} = usePolling();


  function myProfile() {
    const myId = localStorage.getItem("id");
    let push_to = "/users/" + myId;
    navigate(push_to);
  };

  function navigateToFriendList() {
    navigate("/friendList");
  }

  function navigateToUserList() {
    navigate("/userList");
  };

  const joinMatchmaking = () => {
    const userId = localStorage.getItem('id');
    send('matchmaking/join', {});
    toast.info("Looking for a match...");
    subscribe(`/user/${userId}/queue/matchmaking`, response => {
      const data = JSON.parse(response.body);
      if (data.status === "matched") {
        console.log('Match found:', response.gameId);
        navigate(`/kittycards`);
      }
    });

      subscribe(`/user/${userId}/queue/turn-decision`, (message) => {
      const decisionRequest = JSON.parse(message.body);
      console.log(decisionRequest.message);  // "Do you want to go first?"
      // Trigger UI element to let the user decide
    });

  }
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
      disconnect();
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      setCurrentUserId(null);
      toast.dismiss();
      navigate("/login");
    }

    const doMatch = async () => {
      try {
        joinMatchmaking(); // Join matchmaking when user clicks start

      } catch (error) {
        alert(
            `Something went wrong during the login: \n${handleError(error)}`
        );
      }
    };

    return (
        <BaseContainer>
          <div className="navigation container">
            <div className="navigation form">
              <div className="navigation button-container">
                <Button
                    style={{width: "100%", marginBottom: "10px"}}
                    onClick={() => doMatch()}
                >
                  Start
                </Button>
                <Button
                    style={{width: "100%", marginBottom: "10px"}}
                    onClick={() => navigateToFriendList()}
                >
                  Friends
                </Button>
                <Button
                    style={{width: "100%", marginBottom: "10px"}}
                    onClick={() => navigateToUserList()}
                >
                  UserList
                </Button>
                <Button
                    style={{width: "100%", marginBottom: "10px"}}
                    onClick={() => myProfile()}
                >
                  My Profile
                </Button>
                <Button
                    style={{width: "100%", marginBottom: "10px"}}
                    onClick={() => logout()}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </BaseContainer>
    );

};
/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Navigation;
