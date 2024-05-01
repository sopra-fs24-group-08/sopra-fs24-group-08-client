import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseContainer from '../ui/BaseContainer';
import Player from "../ui/Player";
import { useCurrUser } from '../context/UserContext';
import { useData } from '../context/DataContext';
import { Button } from 'components/ui/Button';
import "styles/views/Game.scss";
import {api,handleError} from "helpers/api";

const FriendList = () => {
  const { currUser } = useCurrUser();
  const navigate = useNavigate();
  const { data, refreshData } = useData();
  const { friends } = data;


  //no clue if these REST requests still work just leaving it in, we can adapt them later.
  const doInvite = async(receiverId) => {
    const requestType = "GAMEINVITATION";
    try{
      const requestBody = JSON.stringify({ receiverId, requestType});
      const response = await api.post(`/game/invite/${currUser.id}`,requestBody, {headers: {Authorization: `Bearer ${currUser.token}`}});
      console.log("You have a new message!");
    }catch(error){
      alert(`Something went wrong with friend request: \n${handleError(error)}`);
    }
  };

  const doDelete = async(friendId) => {
    try{
      const response = await api.put(`/users/${currUser.id}/friends/delete`,{}, {headers: {Authorization: `Bearer ${currUser.token}`}, params: {FriendId: friendId}});
      console.log(response.data)
      //window.location.reload();
    }catch(error){
      alert(`Something went wrong with friend deletion: \n${handleError(error)}`);
    }
  };

  let content = (
    <ul className="game user-list">
      {friends.length > 0 ? friends.map(friend => (
        <li key={friend.id}>
          <Player user={friend} />
          <Button onClick={doInvite(friend.id)}>Invite to a Game</Button>
          <Button onClick={doDelete(friend.id)}>Delete this Friend</Button>
        </li>
      )) : <p>No friends to display.</p>}
    </ul>
  );

  return (
    <BaseContainer className="game container">
      <h2>Friend List</h2>
      <p className="game paragraph">List of your current friends.</p>
      {content}
      <Button onClick={refreshData}>Refresh Friends</Button>
      <Button onClick={() => navigate(-1)}>Back</Button>

    </BaseContainer>
  );
};

export default FriendList;
