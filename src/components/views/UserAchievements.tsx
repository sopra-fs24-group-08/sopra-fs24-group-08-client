import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import "styles/ui/UserAchievements.scss";


const UserAchievements = () => {
  //perhaps add Icons, greyed out Icons for locked ones??

  const location = useLocation();
  const { achievements, username } = location.state || { achievements: [], username: '' };
  const navigate = useNavigate();
  const handleClick = () =>{
    navigate(-1)
  }
  return (
    <div className="user-achievements">
      <h2>Achievements of {username}</h2>
      <div className="achievements-list">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="achievement">
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
          </div>
        ))}
      </div>
      <button className="back-btn" onClick={handleClick}>BACK</button>
    </div>
  );
};

export default UserAchievements;