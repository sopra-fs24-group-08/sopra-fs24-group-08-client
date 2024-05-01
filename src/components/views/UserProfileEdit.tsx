import {api, handleError} from "helpers/api";
import {useNavigate, useParams } from "react-router-dom";
import {Button} from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/UserProfileEdit.scss";
import { React, useEffect, useState } from "react";
import Refresh from "../ui/Refresh";
import { useCurrUser} from "../context/UserContext";

const UserProfileEdit = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const currUserString = sessionStorage.getItem("currUser")
  const [username, setUsername] = useState<string>("");
  const [birthday, setBirthday] = useState<string>(null);
  const [password, setPassword] = useState<string>("");

  const {currUser,logout} = useCurrUser();

  useEffect(() => {
    !currUserString && logout();
  }, [currUserString, logout]);
  //Define with others how we want to manage customization changes.

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleBirthdayChange = (event) => {
    setBirthday(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestBody = JSON.stringify({
        username,
        birthday,
        password
      });
      await api.put(`/users/${id}`,requestBody,{
        headers: { Authorization: `Bearer ${currUser.token}` }});

      await Refresh();
      navigate(`/profiles/${id}`);

    }
    catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );

    }
  }
  return (
    <BaseContainer>
      <div className="edit container">
        <form className="edit form" onSubmit={handleSubmit}>
          <div className="edit field">
            <label className="edit label" htmlFor="username">Choose new Username</label>
            <input
              className="edit input"
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="edit field">
            <label className="edit label" htmlFor="password">Enter New Password</label>
            <input
              className="edit input"
              type="text"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="edit field">
            <label className="edit label" htmlFor="birthday">Choose Birthday</label>
            <input
              className="edit input"
              type="date"
              id="birthday"
              name="birthday"
              value={birthday}
              onChange={handleBirthdayChange}
            />
          </div>
          <div className="edit button-container">
            <Button type="submit">Apply Changes</Button>
          </div>
        </form>
      </div>
    </BaseContainer>
  );
};


export default UserProfileEdit;