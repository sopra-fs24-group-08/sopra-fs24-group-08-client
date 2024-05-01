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
import subscribeToGameUpdates from 'components/functions/EventGetter';
import {handleMatch, doQuitQueueing} from 'components/functions/HandleMatch';
import GameBoard from "./GameBoard";

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
  const [gameId, setGameId] = useState(null);
  const myId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (inGame === true){
      navigate("/kittycards");
    }
  }, [inGame])
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

  async function doMatch(myId, token, setLoading){
    const matchResult = await handleMatch(myId, token, setLoading);
    if (matchResult !== null){
      setGameId(matchResult);
    }
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

    localStorage.removeItem("token");
    localStorage.removeItem("id");
    setCurrentUserId(null);
    toast.dismiss();
    navigate("/login");
  }

  function renderContent() {
    if (loading) {
      return (
        <div>
          <div>Loading...</div>
          <div className="navigation button-container">
            <Button
              style={{ width: "100%", marginBottom: "10px" }}
              onClick={() => doQuitQueueing(myId, token, setLoading)}
            >
              Quit
            </Button>
          </div>
        </div>
      );
    }
    if (gameId) {
      return <GameBoard gameId={gameId} myId={myId} />;
    }
    return (    
      <BaseContainer>
        <Header height="100" />
        <div className="navigation container">
          <div className="navigation form">
            <div className="navigation button-container">
              <Button
                style={{ width: "100%", marginBottom: "10px" }}
                onClick={() => doMatch(myId, token, setLoading)}
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
      </BaseContainer>);
  }

  return (
    <div>
      {renderContent()}
    </div>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Navigation;
