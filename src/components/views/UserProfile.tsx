import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import { User } from "types";
import { useCurrUser } from "../context/UserContext";
import "styles/views/UserProfile.scss";

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currUser } = useCurrUser();


  useEffect(() => {
    const url = currUser.id === id ? `/users/${currUser.id}/${currUser.id}` : `/users/${currUser.id}/${id}`;

    async function fetchProfileData() {
      try {
        const response = await api.get(url, {
          headers: { Authorization: `Bearer ${currUser.token}` },
        });
        setUser(response.data);
        setIsLoading(false);
        console.log(response.data);
        console.log(user);
      } catch (error) {
        console.error(`Failed to fetch user data: ${handleError(error)}`);
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, [id]);

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
          </div>
        )}
        <div className="userprofile button-container">
          {currUser.id === user.id && <Button onClick={() => navigate(`/profiles/${id}/edit`)}>Edit</Button>}
          <Button style={{ width: "80%" }} onClick={() => navigate(-1)}>Back</Button>
        </div>
      </div>
      {user.currIcon && (
        <div>
          <img src={user.currIcon.imageUrl} alt={`${user.username}'s icon`} />
          <div>Icon Name: {user.currIcon.name}</div>
        </div>
      )}
    </BaseContainer>
  );
};

export default UserProfile;
