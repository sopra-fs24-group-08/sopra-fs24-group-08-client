import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import Player from "../ui/Player";
import { useCurrUser } from "../context/UserContext";
import { useData } from "../context/DataContext";
import { Button } from "components/ui/Button";
import "styles/views/FriendList.scss";
import { api, handleError } from "helpers/api";
import Mailbox from "components/ui/Mailbox";
import {useFriend} from "../context/FriendContext";

const FriendList = () => {
  const navigate = useNavigate();
  const { data, refreshData } = useData();
  const { friends, friendRequests } = data;
  const { currUser } = useCurrUser();
  const {sendGameInvitation} = useFriend();

  const doInvite = async (friendId) => {
    sendGameInvitation(friendId, currUser);
  };

  const doDelete = async (friendId) => {
    try {
      await api.put(`/users/${currUser.id}/friends/delete`, {}, {
        headers: { Authorization: `Bearer ${currUser.token}` },
        params: { FriendId: friendId }
      });
      refreshData("friends");
    } catch (error) {
      handleError(error);
    }
  };

  const content = friends.length > 0 ? (
    <ul className="friend user-list">
      {friends.map(friend => (
        <li key={friend.id}>
          <Player user={friend} />
          <Button onClick={() => doInvite(friend.id)}>Invite to a Game</Button>
          <Button onClick={() => doDelete(friend.id)}>Delete this Friend</Button>
        </li>
      ))}
    </ul>
  ) : (
    <p>No friends to display.</p>
  );

  return (
    <BaseContainer className="friendlist container">
      <h2>Friend List </h2>
      <p className="friendlist paragraph">List of your current friends.</p>
      {content}
      <div className="actions">
        <Button className="refresh-btn" onClick={() => refreshData()}></Button>
        <Button className="back-btn" onClick={() => navigate(-1)}>Back</Button>
        <Mailbox />
      </div>
    </BaseContainer>
  );
};

export default FriendList;
