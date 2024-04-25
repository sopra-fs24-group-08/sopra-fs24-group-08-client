import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "types";
import { useAuth } from "components/context/AuthContext";

const FriendList = ({ user }: { user: User }) => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const { websocket } = useAuth();

  function userProfile (id){
    navigate("/users/" + id);
  }
  /*function myProfile (){
    const myId = localStorage.getItem("id");
    let push_to = "/users/" + myId;
    navigate(push_to);
  };*/
  const doInvite = (receiverId) => {
    websocket.send(`/app/game/invite`, {}, JSON.stringify({ receiverId }));
    console.log("Game invitation sent to user ID:", receiverId);
  };

  const sendGameInvite = async(receiverId) => {
    const id =  localStorage.getItem("id")
    const token = localStorage.getItem("token")
    const gameInvite = {
      senderId: id,          // Assuming senderId is a numeric ID
      senderName: "",// Sender's name
      receiverId: receiverId,        // Assuming receiverId is a numeric ID
      receiverName: "", // Receiver's name
      requestType: "GAMEINVITATION", // Type of the request, string representing an enum in your backend
      status: "SENT"       // Current status of the request, string representing an enum in your backend
    };
    try{
      const requestBody = JSON.stringify(gameInvite);
      const response = await api.post(`/game/invite/${id}`,requestBody,{ headers:{Authorization:`Bearer ${token}`}});
      if (response.status === 201 || response.status === 200) {
        console.log('Game Invite sent successfully');
      }}catch(error){
      alert(error.message);
    }
  };


  function doSpectate (id){
      // Spectate feature (not implemented yet)
  };

  function goBack (){
    navigate("/navigation")

  };
  const Player = ({ user }: { user: User }) => {
    const myId = localStorage.getItem("id");

    if (user.id.toString() === myId) return null;

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
          onClick={() => sendGameInvite(user.id)}
          className="game username-button-container"
        >
          invite
        </Button>

        <Button
          width="500px"
          onClick={() => doSpectate(user.id)}
          className="game username-button-container"
        >
          spectate
        </Button>
      </div>
    );
  };


  Player.propTypes = {
    user: PropTypes.object,
  };

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://react.dev/reference/react/useEffect
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const myId = localStorage.getItem("id");
        const response = await api.get(`/users/${myId}/friends`,{headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        if (response.data !== null) {
          setFriends(response.data);
        }

        // This is just some data for you to see what is available.
        // Feel free to remove it.

        /*console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);*/

        // See here to get more data.
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

  if (friends) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {friends.map((user: User) => (
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

export default FriendList;
