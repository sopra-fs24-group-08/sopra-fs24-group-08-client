import React from "react";
import { useNavigate } from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import Player from "../ui/Player";
import { useData } from "../context/DataContext";
import { Button } from "components/ui/Button";
import { useCurrUser } from "../context/UserContext";
import {useFriend} from "../context/FriendContext";
import "../../styles/views/UserList.scss";


const UserList = () => {
  const navigate = useNavigate();
  const { data, refreshData } = useData();
  const { users } = data;
  const { currUser} = useCurrUser();
  const {sendFriendRequest} = useFriend();

  const handleSendFriendRequest = (user, e) => {
    e.stopPropagation();
    sendFriendRequest(user.id, currUser);
  }

  const isAlreadyFriend = (userId) => {

    return data.friends.some(friend => friend.id === userId);
  };

  return (
    <BaseContainer className="userlist container">
      <h2>Users Overview</h2>
      <p className="userlist paragraph">Select a user to view their profile or send a friend request.</p>
      <ul className="userlist user-list">
        {users.length > 0 ? users.map(user => (
          <li key={user.id} className="user-item">
            <div className="user-info" onClick={() => navigate(`/profiles/${user.id}`)}>
              <Player user={user} />
              {currUser.id !== user.id && !isAlreadyFriend(user.id) && (
                <Button className="friend-request-btn" onClick={(e) => handleSendFriendRequest(user, e)}>
                  Send Friend Request
                </Button>
              )}
            </div>
          </li>
        )) : <p>No users to display.</p>}
      </ul>
      <div className="actions">
        <Button className="refresh-btn" onClick={() => refreshData()}></Button>
        <Button className="back-btn" onClick={() => navigate(-1)}>Back</Button>
      </div>
    </BaseContainer>
  );
};

export default UserList;
