import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "types";

const Game = ({ user }: { user: User }) => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const logout = (): void => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  function userProfile (id){
    let push_to = "/users/" + String(id);
    navigate(push_to);
  };
  function myProfile (){
    const myId = localStorage.getItem("id");
    let push_to = "/users/" + myId;
    navigate(push_to);
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
        const response = await api.get("/users");

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
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
          ))}
        </ul>
        <Button
          style={{ width: "100%", marginBottom: "10px" }}
          onClick={() => logout()}
        >
          Logout
        </Button>
        <Button
          style={{ width: "100%", marginBottom: "10px" }}
          onClick={() => myProfile()}
        >
          My Profile
        </Button>

      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Users Overview</h2>
      <p className="game paragraph">
        Select a user to view!
      </p>
      {content}
    </BaseContainer>
  );
};

export default Game;
