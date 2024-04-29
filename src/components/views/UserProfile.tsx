import { useNavigate, useParams } from "react-router-dom";
import { React, useEffect, useState } from "react";
import {api, handleError} from "helpers/api";
import {Button} from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/UserProfile.scss";
import editProfile from "./UserProfileEdit";
import { useCurrUser } from '../context/UserContext';
import User from "models/User";


const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get user ID from URL after clicking on Profile
  const { currUser } = useCurrUser(); // Access current user from context
  const isCurrentUser = currUser && currUser.id === id;
  const [user, setUser] = useState<User>(null);



  const handleEdit = () => {
    navigate(`/profiles/${id}/edit`);
  };

  //Backend you can easily check if my own profile,strangers profile or friends profile
  useEffect(() => {
    async function fetchProfileData() {
      try {
        const response = await api.get(`/users/${id}`, {headers: {Authorization: `Bearer ${currUser.token}`}});
        setUser(new User(response.data));
        console.log(user)
      }catch (error) {
        alert(`Something went wrong during getting user profile: \n${handleError(error)}`);
      }
    }
    fetchProfileData();
  }, [id, currUser.token]);

  const renderUserInfo = (user) => {
    if (!user) return null; // Return null if user is not yet fetched or undefined

    // Filter out null or undefined attributes and exclude arrays from display
    const filteredEntries = Object.entries(user)
      .filter(([key, value]) => value !== null && value !== undefined && !Array.isArray(value));

    return (
      <>
        {filteredEntries.map(([key, value]) => (
          <div key={key} className="userprofile text">
            {`${key}: ${value}`}
          </div>
        ))}
        {currUser.id === user.id && (
          <Button
            width="100%"
            onClick={() => navigate(`/profiles/${id}/edit`)}
            className="userprofile button-container"
          >
            Edit
          </Button>
        )}
        <Button
          width="100%"
          onClick={() => navigate(-1)} // Navigates back in history
          className="userprofile button-container"
        >
          Back
        </Button>
      </>
    );
  };

  return (
    <BaseContainer className="userprofile container">
      <h2>About</h2>
      {renderUserInfo(user)}
    </BaseContainer>
  );
};

export default UserProfile;