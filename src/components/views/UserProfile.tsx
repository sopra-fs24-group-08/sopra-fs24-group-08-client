import { useNavigate, useParams } from "react-router-dom";
import { React, useEffect, useState } from "react";
import {api, handleError} from "helpers/api";
import {Button} from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/UserProfile.scss";


const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const {id} = useParams();
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const [content, setContent] = useState(null);


  function goBack () {
    navigate("/navigation");
  }

  function editProfile(user) {
    const push_to = "/edit/" + String(user.username) +
      "/" + String(user.status) +
      "/" + String(user.creation_date) +
      "/" + String(user.birthday) +
      "/" + String(user.id)

    navigate(push_to);
  }

  useEffect(() => {
    async function fetchFullUserData() {
      try {
        const response = await api.get(`/users/self/${id}`, {headers: {Authorization: `Bearer ${token}`}});
        setUser(response.data);      
      }catch (error) {
        alert(`Something went wrong during getting user profile: \n${handleError(error)}`);
      }
    }

    async function fetchOtherUserData() {
      try {
        const response = await api.get(`/users/other/${id}`, {headers: {Authorization: `Bearer ${token}`}});
        setUser(response.data);         
      }catch (error) {
        alert(`Something went wrong during getting user profile: \n${handleError(error)}`);
      }
    }
    if (id === userId){fetchFullUserData();}
    else {fetchOtherUserData();}
  }, [id]);

  // Separate useEffect to update content when `user` changes
  useEffect(() => {
    if (user) {
      if (id === userId) {
        setContent(getFullUser(user));
      } else {
        setContent(getOtherUser(user));
      }
    }
  }, [user, id, userId]);  

  const getFullUser = (user) => {
    return (            
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
      </div>)
  }

  const getOtherUser = (user) => {
    return (
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