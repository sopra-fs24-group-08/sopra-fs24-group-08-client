import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { User } from "types";
import LogoutButton from "../ui/LogoutButton";
import "styles/views/FriendsList.scss";


const friends_mock = [
  //for testing purposes,remove later once we merge the stuff
  { username: 'Friend1', status: 'ONLINE' },
  { username: 'Friend2', status: 'PLAYING' },
  { username: 'Friend3', status: 'OFFLINE' },
];


const FriendsList = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const currUserString = localStorage.getItem("currUser");
  const user = JSON.parse(currUserString);

    useEffect(() => {
      fetch(`/users/friends/${user.id}`)
        .then(response => response.json())
        .then(setFriends)
        .catch(console.error);
    }, [user.id]);
  const handleBackClick = () => {
    navigate(-1);  // Go back to the previous page
  };

  return (
    <div className="friends-list">
      <h1>FRIEND LIST</h1>
      {friends.map(friend=> (
        <div key={friend.id} className="friend-item">
          <span className="friend-name">{friend.username}</span>
          <span className={`friend-status ${friend.status.toLowerCase()}`}>{friend.status}</span>
          {
            friend.status === 'ONLINE' ? (
              <button className="action-btn">INVITE</button>
            ) : friend.status === 'PLAYING' ? (
              <button className="action-btn">SPECTATE</button>
            ) : (
              <button className="action-btn disabled" disabled>INVITE</button>
            )
          }
          <button className="delete-btn">delete</button>
        </div>
      ))}
      <div className="add-friend">
        <input type="text" placeholder="Enter Username" />
        <button>Add Friend</button>
      </div>
      <button className="back-btn" onClick={handleBackClick}>BACK</button>
    </div>
  );
};

export default FriendsList;

