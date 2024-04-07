import React, { useEffect, useState } from "react";
import { api,} from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import ProfileEdit from "../ui/ProfileEdit";
import { User } from "types";
import "styles/views/Profile.scss";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player id">id: {user.id}</div>
    <div className="player username">{user.username}</div>
    <div className="player status">status: {user.status}</div>

  </div>
);
Player.propTypes = {
  user: PropTypes.object,
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User[]>(null);
  const id = window.location.pathname.split("/").pop();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${id}`, {
          headers: { "Authorization": localStorage.getItem("token") }
        });
        setUser(response.data); // Set user data in state
      } catch (error) {

      }
    };

    fetchUser(); // Call the function to fetch user data
  }, []); // Depend on id to refetch data when id changes

  if (!user) {
    return <div></div>;
  }

  return (

    <BaseContainer className="profile container">
      <Button
        onClick={() => navigate("/profiles")}
      >
          Back
      </Button>
      <div>
        <h1>User Profile</h1>
        <p>ID: {user.id}</p>
        <p>Username: {user.username}</p>
        <p>Creation Date: {user.creation_date}</p>
        <p>Status: {user.status}</p>
        {user.birthday && <p>Birthday: {user.birthday}</p>} {/* This line checks if birthday is not null */}
      </div>

      <div className="button-group">
        <p></p>
        <ProfileEdit id={id} />
      </div>
    </BaseContainer>
  );
};

export default Profile;