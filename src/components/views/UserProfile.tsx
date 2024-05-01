import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, handleError } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import BaseContainer from 'components/ui/BaseContainer';
import { User } from 'types';
import { useCurrUser } from "../context/UserContext";


const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currUser } = useCurrUser();



  const handleEdit = () => {
    navigate(`/profiles/${id}/edit`);
  };

  useEffect(() => {
    const url = currUser.id === id ? `/users/${currUser.id}/${currUser.id}` : `/users/${currUser.id}/${id}`;
    async function fetchProfileData() {
      try {
        const response = await api.get(url,{ headers: { Authorization: `Bearer ${currUser.token}`}
    });
        setUser(response.data);
        setIsLoading(false);
        console.log(response.data)
        console.log(user)
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
      <h2>{`${user.username}'s Profile`}</h2>
      <div>ID: {user.id}</div>
      <div>Status: {user.status}</div>
      {user.birthday && <div>Birthday: {user.birthday}</div>}
      {user.currIcon && (
        <div>
          <img src={user.currIcon.imageUrl} alt={`${user.username}'s icon`} style={{ width: 50, height: 50 }} />
          <div>Icon Name: {user.currIcon.name}</div>
        </div>
      )}
      <div>Creation Date: {user.creation_date}</div>
      {currUser.id === user.id && (
        <Button
          width="100%"
          onClick={() => navigate(`/profiles/${id}/edit`)}
          className="userprofile button-container"
        >
          Edit
        </Button>
      )}
      <Button onClick={() => navigate(-1)}>Back</Button>
    </BaseContainer>
  );
};

export default UserProfile;
