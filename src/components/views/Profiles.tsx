import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profiles.scss";
import { User } from "types";
import LogoutButton from "../ui/LogoutButton";

const Player = ({ user }) => {
  const navigate = useNavigate();
  const headToProfile = (id) => {

    localStorage.setItem("id",id)

    // Ask TA if there's not  a way to simply use ""
    navigate(`/profiles/${id}`);};

  return (
    <div className="player container" onClick={() => headToProfile(user.id)}>
      <div className="player info">
        <div className="player info username">{user.username}</div>
        <div className={`player info status ${user.status.toLowerCase()}`}>
          {user.status}
        </div>
      </div>
    </div>

  );
};

// Define the PropTypes for the Player component
Player.propTypes = {
  user: PropTypes.object,
};


function Profiles() {

  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(null);
  const currUserString = localStorage.getItem("currUser");
  const user = JSON.parse(currUserString);

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

      <div className="profiles">
        <Button

          onClick={()=> navigate(`/profiles/${user.id}`)}
        >
          See your own profile
        </Button>
        <ul className="profiles user-list">
          {users.map((user: User) => (
            <li key={user.id}>
              <Player user={user} />
            </li>

          ))}
        </ul>
        <LogoutButton></LogoutButton>
      </div>
    );
  }

  return (

    <BaseContainer className="base-container">

      <p>
        {content}</p>
    </BaseContainer>

  );
}

export default Profiles;
