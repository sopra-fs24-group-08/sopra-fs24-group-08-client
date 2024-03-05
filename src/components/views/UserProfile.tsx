import { useNavigate, useParams } from "react-router-dom";
import { React, useEffect, useState } from "react";
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/UserProfile.scss";


const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUsers] = useState(null);
  const {id} = useParams();

  function goBack () {
    navigate("/game");
  }

  function editProfile(user) {
    const push_to = '/edit/' + String(user.username) +
      '/' + String(user.status) +
      '/' + String(user.creation_date) +
      '/' + String(user.birthday) +
      '/' + String(user.id)

    navigate(push_to);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const request_to = '/users/' + String(id)
        const response = await api.get(request_to);

        setUsers(response.data);

      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the user details! See the console for details.");
      }
    }

    fetchData();
  }, [id]);

  let content;

  if (user && localStorage.getItem("id") === String(user.id)) {
    content = (
      <div className="userprofile text">
        <div className="userprofile text"> username: {user.username} </div>
        <div className="userprofile text"> online status: {user.status}</div>
        <div className="userprofile text"> creation date: {user.creation_date} </div>
        <div className="userprofile text"> birthday: {user.birthday} </div>

        <Button
          width="100%"
          onClick={() => editProfile(user)}
          className = "userprofile button-container"
        >
          Edit
        </Button>
        <Button
          width="100%"
          onClick={() => goBack()}
          className = "userprofile button-container"
        >
          Back
        </Button>
      </div>
    );
  }
  else if (user) {
    content = (
      <div className="userprofile text">
        <div className="userprofile text"> username: {user.username} </div>
        <div className="userprofile text"> online status: {user.status}</div>
        <div className="userprofile text"> creation date: {user.creation_date} </div>
        <div className="userprofile text"> birthday: {user.birthday} </div>
        <Button
          width="100%"
          onClick={() => goBack()}
          className = "userprofile button-container"
        >
          Back
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="userprofile container">
      <h2>About</h2>
      {content}
    </BaseContainer>
  );
};

export default UserProfile;