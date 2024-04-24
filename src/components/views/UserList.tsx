import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "types";
import { useAuth } from "components/context/AuthContext";

const UserList = ({ user }: { user: User }) => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const {status} = useParams();
  const { websocket } = useAuth();

  function userProfile (id){
    let push_to = "/users/" + String(id);
    navigate(push_to);
  }

  const sendFriendRequest = (receiverId) => {
    websocket.sendFriendRequest(receiverId);
    console.log(`Friend request to user with id${receiverId} sent!`);
  };

  /*onsole.log("Game invitation sent!");
  const doAddFriend = async(receiverId) => {
    const myId = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const requestType = "FRIENDADDING";
    console.log(myId);
    console.log(token);
    try{
      const requestBody = JSON.stringify({ receiverId, requestType});
      const response = await api.post(`/users/${myId}/friends/add`,requestBody, {headers: {Authorization: `Bearer ${token}`}});
      console.log("You have a new message!");
    }catch(error){
      alert(`Something went wrong with friend request: \n${handleError(error)}`);
    }
  };*/

  function goBack (){
    navigate("/navigation")

  };
  const Player = ({ user }: { user: User }) => {

    return (
      <div className="player container">
        <Button
          width="500px"
          onClick={() => userProfile(user.id)}
          className="game username-button-container"
        >
          {user.username}
        </Button>
        <Button
          width="500px"
          onClick={() => sendFriendRequest(user.id)}
          className="game username-button-container"
        >
          add
        </Button>
      </div>
    );
  };


  Player.propTypes = {
    user: PropTypes.object,
  };


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users",{headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        if (response.data !== null) {
          setUsers(response.data);
        }

        // See here to get more data.
        console.log(response.status);
        console.log(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the friends: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the friends! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  let content = <Spinner />;

  if (users) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {users.map((user: User) => (
            <li key={user.id}>
              <Player user={user} />
            </li>
          ))
          }
        </ul>

      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Users Overview</h2>
      <p className="game paragraph">
        Select a friend to view!
      </p>
      {content}
      <Button
        width="500px"
        onClick={() => goBack()}
        className="game username-button-container"
      >
        Back
      </Button>
    </BaseContainer>
  );
};

export default UserList;
