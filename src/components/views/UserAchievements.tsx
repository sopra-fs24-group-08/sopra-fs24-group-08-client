import React from "react";
import "styles/views/UserAchievements.scss";
import { useLocation, useNavigate } from "react-router-dom";

const UserAchievements = () => {
  const location = useLocation();
  const { achievements, username } = location.state || { achievements: [], username: "" };
  const navigate = useNavigate();

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
      <button className="back-btn" onClick={() => navigate(-1)}>BACK</button>
    </div>
  );
};

export default UserAchievements;