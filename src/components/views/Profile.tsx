import React, { useEffect, useState } from "react";
import { api,} from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import ProfileEdit from "../ui/ProfileEdit";
import { User } from "types";
import "styles/views/Profile.scss";
import { Achievement, AchievementsCollection } from "../../models/Achievements";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player id">id: {user.id}</div>
    <div className="player username">{user.username}</div>
    <div className="player status">status: {user.status}</div>
    <div className="player icon">icon: {user.currIcon}</div>
    <div className="player achievements">
      <h3>Achievements</h3>
      {user.achievements.map((achievement) => (
        <div key={achievement.id}>
          <p>Title: {achievement.title}</p>
          <p>Description: {achievement.description}</p>
        </div>
      ))}
    </div>
  </div>
);
Player.propTypes = {
  user: PropTypes.object,
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const id = window.location.pathname.split("/").pop();
  const loggedInUserId = localStorage.getItem("currUser") ? JSON.parse(localStorage.getItem("currUser")).id : null;
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
  }, []);

  if (!user) {
    return <div></div>;
  }

  return (
    <BaseContainer className="profile container">
      <Button onClick={() => navigate("/profiles")}>
        Back
      </Button>
      <div>
        <h1>User Profile</h1>
        <p>ID: {user.id}</p>
        <p>Icon: <img style={{ width: 44, height: 44 }} src={user.currIcon.imageUrl} alt="User Icon" />
        </p>
        <p>Username: {user.username}</p>
        <p>Achievements:
          <Button onClick={() => navigate(`/profiles/${id}/achievements`, { state: {
              achievements: user.achievements,
              username: user.username
            } })}>
            See Achievements
          </Button></p>
        <p>Creation Date: {user.creation_date}</p>
        <p>Status: {user.status}</p>
        {user.birthday && <p>Birthday: {user.birthday}</p>}
      </div>

      <div className="button-group">
        <ProfileEdit id={id} />
      </div>
      <div className="bottom-button">
        {user && loggedInUserId.toString() === id.toString() && (
          <Button onClick={() => navigate(`/friendslist/${user.id}`)}>
            Friendslist
          </Button>
        )}
      </div>
    </BaseContainer>

  );
};

export default Profile;