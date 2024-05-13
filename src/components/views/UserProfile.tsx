import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";

import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import { User } from "types";
import { useCurrUser } from "../context/UserContext";
import "styles/views/UserProfile.scss";
import { fetchCatAvatar } from '../../helpers/avatarAPI';

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currUser } = useCurrUser();
  const [iconName, setIconName] = useState('Default Icon'); // 初始化为用户当前的图标名称
  const [avatarUrl, setAvatarUrl] = useState('');  // 新状态来存储头像 URL


  useEffect(() => {
    const url = currUser.id === id ? `/users/${currUser.id}/${currUser.id}` : `/users/${currUser.id}/${id}`;

    async function fetchProfileData() {
      try {
        const response = await api.get(url, {
          headers: { Authorization: `Bearer ${currUser.token}` },
        });
        setUser(response.data);
        setAvatarUrl(response.data.currIcon ? response.data.currIcon.imageUrl : '/images/DefaultAvatar.png');  // 使用 API 返回的头像或默认头像
        setIsLoading(false);
        console.log(response.data);
        console.log(user);
      } catch (error) {
        console.error(`Failed to fetch user data: ${handleError(error)}`);
        setIsLoading(false);
      }

      try {
        const response = await api.get(`/users/${currUser.id}`);
        setUser(response.data);
        setAvatarUrl(response.data.avatarUrl); // 使用从后端获取的头像 URL
      } catch (error) {
        console.error(`Failed to fetch avatar: ${error}`);
      }
    }

    fetchProfileData();
  }, [id]);

  const handleAvatarChange = async () => {
    const newAvatarUrl = await fetchCatAvatar(iconName); // 请求新头像
    setAvatarUrl(newAvatarUrl);
  };

  const handleSaveAvatar = async () => {
    try {
      // 假设 avatarUrl 是用户当前选择的头像 URL
      await api.put(`/users/${id}/updateIcon`, { avatarUrl });
      alert('Avatar saved successfully!');
    } catch (error) {
      console.error('Failed to save avatar:', error);
      alert('Failed to save avatar.');
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
          </div>
        )}
        <div className="userprofile button-container">
          {currUser.id === user.id && <Button onClick={() => navigate(`/profiles/${id}/edit`)}>Edit</Button>}
          <Button style={{ width: "80%" }} onClick={() => navigate(-1)}>Back</Button>
        </div>
      </div>
      {user.currIcon && (
        <div>
          <img src={avatarUrl} alt={`${user.username}'s icon`} style={{ width: 100, height: 100 }} />
          <div>
            Icon Name: <input type="text" value={iconName} onChange={e => setIconName(e.target.value)} />
          </div>
          <Button style={{ height: "10%", width: "55%" }}onClick={handleAvatarChange}>Change Avatar</Button>
          <Button style={{ height: "10%", width: "45%" }}onClick={handleSaveAvatar}>Save Avatar</Button>
        </div>
      )}
    </BaseContainer>
  );
};

export default UserProfile;
