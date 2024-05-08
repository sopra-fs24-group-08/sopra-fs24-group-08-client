import React from "react";
import { useNavigate } from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import Player from "../ui/Player";
import { useData } from "../context/DataContext";
import { Button } from "components/ui/Button";
import { useCurrUser } from "../context/UserContext";
import { api, handleError } from "helpers/api";
import "../../styles/views/UserList.scss";


const UserList = () => {
  const navigate = useNavigate();
  const { data, refreshData } = useData();
  const { users } = data;
  const { currUser} = useCurrUser();

  const handleSendFriendRequest = async (user, e) => {
    e.stopPropagation();
    //const url = `/users/${currUser.id}/friends/add`; path we would actually use
    const url = `/users/${currUser.id}/friends/testadd`;
    try {
      const response = await api.post(url, { id: user.id, username: user.username }, {
        headers: { Authorization: `Bearer ${currUser.token}` }
      });
      alert("Friend request sent!");
      if (response.data){
        refreshData();
      }
      //Might use this later for a special response regarding friends accepted/declined
    } catch (error) {
      console.error("Failed to send friend request:", handleError(error));
      alert("Failed to send friend request");
    }
  };
  // Need to still add button removal if user already friend

  return (
    <BaseContainer className="userlist container">
      <h2>Users Overview</h2>
      <p className="userlist paragraph">Select a user to view their profile or send a friend request.</p>
      <ul className="userlist user-list">
        {users.length > 0 ? users.map(user => (
          <li key={user.id} className="user-item">
            <div className="user-info" onClick={() => navigate(`/profiles/${user.id}`)}>
              <Player user={user} />
              {currUser.id !== user.id && (
                <Button className="friend-request-btn" onClick={(e) => handleSendFriendRequest(user, e)}>
                  Send Friend Request
                </Button>
              )}
            </div>
          </li>
        )) : <p>No users to display.</p>}
      </ul>
      <div className="actions">
        <button className="refresh-btn" onClick={refreshData}></button>
        <Button className="back-btn" onClick={() => navigate(-1)}>Back</Button>
      </div>
    </BaseContainer>
  );
};

export default UserList;
