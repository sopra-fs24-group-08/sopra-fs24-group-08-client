import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";

import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import { User } from "types";
import { useCurrUser } from "../context/UserContext";
import "styles/views/UserProfile.scss";
import { fetchCatAvatar } from "../../helpers/avatarAPI";
import defaultAvatar from '../../images/OGIcon.jpg';

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currUser } = useCurrUser();
  const [iconName, setIconName] = useState("Default Icon"); // Initialized to the user's current icon name
  const [avatarUrl, setAvatarUrl] = useState("");  // New state to store avatar URLs

  useEffect(() => {
    const url = currUser.id === id ? `/users/${currUser.id}/${currUser.id}` : `/users/${currUser.id}/${id}`;

    async function fetchProfileData() {
      try {
        const response = await api.get(url, {
          headers: { Authorization: `Bearer ${currUser.token}` },
        });
        const newAvatarUrl = response.data.avatarUrl || defaultAvatar;
        setUser(prevUser => ({
          ...prevUser,
          ...response.data,
          avatarUrl: newAvatarUrl 
        }));
        setAvatarUrl(newAvatarUrl); // Update external avatarUrl status
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setAvatarUrl(defaultAvatar); // Use default avatar in case of error
        setUser(prevUser => ({
          ...prevUser,
          avatarUrl: defaultAvatar
        }));
        setIsLoading(false);
      }
    }//Why exactly calling twice? bug during merge?

    fetchProfileData();
  }, [id, currUser.token]);

  const handleAvatarChange = async () => {
    try {
      const newAvatarUrl = await fetchCatAvatar(iconName);
      console.log("Fetched new avatar URL:", newAvatarUrl); // Print the fetched URL
      setAvatarUrl(newAvatarUrl);
      // Update avatarUrl in user state
      setUser(prevUser => ({
        ...prevUser,
        avatarUrl: newAvatarUrl
      }));

    } catch (error) {
      console.error("Failed to fetch new avatar:", error);
      alert("Failed to fetch new avatar.");
    }
  };


  const handleSaveAvatar = async () => {
    try {
      const payload = {
        imageUrl: avatarUrl,
      };

      console.log("Sending payload to server:", payload);  // Print the payload before sending
      console.log(`URL being sent to: /users/${id}/updateIcon`); // Display the target URL of the request

      await api.put(`/users/${id}/updateIcon`, JSON.stringify(payload), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Payload sent successfully"); // Confirmation that the request was sent successfully
      alert("Avatar saved successfully!");
    } catch (error) {
      console.error("Failed to save avatar:", error);
      alert("Failed to save avatar.");
    }
  };


  if (isLoading) return <Spinner />;
  if (!user) return <div>No user data found.</div>;

  return (
    <BaseContainer className="userprofile container">
      <div style={{ flex: 1 }}>
        <h2>{`${user.username}'s Profile`}</h2>
        <div>ID: {user.id}</div>
        <div>Status: {user.status}</div>
        {user.birthday && <div>Birthday: {user.birthday}</div>}
        <div>Creation Date: {user.creation_date}</div>
        {user.achievements && (
          <div>
            <h3>Achievements</h3>
            <Button onClick={() => navigate(`/profiles/${id}/achievements`, {
              state: {
                achievements: user.achievements,
                username: user.username,
              },
            })}>
              See Achievements
            </Button>
          </div>        )}
        <div className="userprofile button-container">
          {currUser.id === user.id && <Button onClick={() => navigate(`/profiles/${id}/edit`)}>Edit</Button>}
          <Button style={{ width: "80%" }} onClick={() => navigate(-1)}>Back</Button>
        </div>      </div>      {user.currIcon && (
      <div>
        <img src={user.avatarUrl} alt={`${user.username}'s icon`} style={{ width: 100, height: 100 }} />
        <div>            Icon Name: <input type="text" value={iconName} onChange={e => setIconName(e.target.value)} />
        </div>          <Button style={{ height: "10%", width: "55%" }} onClick={handleAvatarChange}>Change Avatar</Button>
        <Button style={{ height: "10%", width: "45%" }} onClick={handleSaveAvatar}>Save Avatar</Button>
      </div>      )}
    </BaseContainer>
  );
};

export default UserProfile;