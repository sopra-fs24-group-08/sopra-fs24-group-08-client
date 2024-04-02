import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/UserEdit.scss";
import BaseContainer from "components/ui/BaseContainer";
import Refresh from "../ui/Refresh";
const UserEdit = () => {
  const navigate = useNavigate(); // Hook for navigation
  const currUserString = localStorage.getItem("currUser");
  const user = JSON.parse(currUserString);
  const [username, setUsername] = useState(user.username);
  const [birthday, setBirthday] = useState(user.birthday);
  try{
    localStorage.removeItem("id")
  }finally {localStorage.setItem("id",user.id)}

  // Event handlers for input changes
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleBirthdayChange = (event) => {
    setBirthday(event.target.value);
  };

  // Optional: Submit handler
  const handleSubmit = (event) => {
    event.preventDefault();
    submitChanges();
  };
  const submitChanges = async () =>{
    const id = user.id
    //User as parameter? send the entire object? creation_date status, etc?
    try {
      const requestBody = JSON.stringify({username,birthday});
      await api.put(`/users/${id}`,requestBody,{
        headers: { "Authorization": localStorage.getItem("token") }});

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

export default UserEdit;